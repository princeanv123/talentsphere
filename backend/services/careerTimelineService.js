
const supabase = require("../config/supabase");

const {
  calculateDuration,
  calculateMonths,
  monthsToDuration,
} = require("../utils/dateUtils");
const {
  detectEmploymentGaps,
} = require("../utils/gapDetectionUtils");
const getCareerTimeline = async (candidateId) => {

  // ===============================
  // Candidate Details
  // ===============================

  const {
    data: candidate,
    error: candidateError,
  } = await supabase
    .from("candidates")
    .select(`
      id,
      full_name,
      current_company,
      current_title
    `)
    .eq("id", candidateId)
    .single();

  if (candidateError) {
    throw candidateError;
  }

  // ===============================
  // Employment History
  // ===============================

  const {
    data: timeline,
    error,
  } = await supabase
    .from("candidate_experience")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("start_date", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  // ===============================
  // Analytics Variables
  // ===============================

  let totalMonths = 0;

  let longestMonths = 0;

  let longestCompany = "";

  let missingDateRecords = 0;

  // ===============================
  // Enrich Timeline
  // ===============================

  const enrichedTimeline = timeline.map(job => {

    const months = calculateMonths(
      job.start_date,
      job.end_date
    );

    if (!job.start_date) {
      missingDateRecords++;
    }

    totalMonths += months;

    if (months > longestMonths) {

      longestMonths = months;

      longestCompany = job.company_name;

    }

    return {

      ...job,

      duration: calculateDuration(
        job.start_date,
        job.end_date
      ),

      durationMonths: months,

      status: job.currently_working
        ? "Current"
        : "Completed",

    };

  });

  // ===============================
  // Current Job
  // ===============================

  const currentJob =
    enrichedTimeline.find(
      job => job.currently_working
    );
// ===============================
// Employment Gap Detection
// ===============================

const detectedGaps =
  detectEmploymentGaps(enrichedTimeline);

const employmentGaps =
  detectedGaps.map(gap => ({

    ...gap,

    gap:
      monthsToDuration(gap.gapMonths),

    status:
      gap.gapMonths > 6
        ? "Significant Gap"
        : "Needs Review",

  }));
  // ===============================
  // Summary
  // ===============================

  const summary = {

    totalExperience:
      monthsToDuration(totalMonths),

    companiesWorked:
      enrichedTimeline.length,

    currentCompany:
      candidate.current_company,

    currentTitle:
      candidate.current_title,

    currentTenure:
      currentJob
        ? calculateDuration(
            currentJob.start_date,
            currentJob.end_date
          )
        : "",

    longestTenure: {

      company: longestCompany,

      duration:
        monthsToDuration(longestMonths),

    },

    averageTenure:
      enrichedTimeline.length
        ? monthsToDuration(
            Math.round(
              totalMonths /
              enrichedTimeline.length
            )
          )
        : "",

    missingDateRecords,

  };

return {

  candidate: {

    id: candidate.id,

    name: candidate.full_name,

  },

  summary,

  employmentGaps,

  timeline: enrichedTimeline,

};
};
module.exports = {
  getCareerTimeline,
};