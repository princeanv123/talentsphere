const { createApplication } = require("../services/applicationService");

const VALID_STATUS = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
  "Withdrawn",
];

const createApplicationController = async (req, res) => {
  try {
    let {
      candidate_id,
      job_id,
      status,
      recruiter_notes,
      interview_date,
    } = req.body;

    // Trim string inputs
    candidate_id = candidate_id?.trim();
    job_id = job_id?.trim();
    status = status?.trim() || "Applied";
    recruiter_notes = recruiter_notes?.trim();

    // Required field validation
    if (!candidate_id || !job_id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID and Job ID are required.",
      });
    }

    // Status validation
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await createApplication({
      candidate_id,
      job_id,
      status,
      recruiter_notes,
      interview_date,
    });

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createApplicationController,
};