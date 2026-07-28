const {
  createApplication,
  getApplicationsByJob,
  getApplicationsByCandidate,
  updateApplicationStatus,
  deleteApplication,
} = require("../services/applicationService");

const VALID_STATUS = [
  "Applied",
  "Screening",
  "Interview Scheduled",
  "Technical Round",
  "HR Round",
  "Offered",
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

const getApplicationsByJobController = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    const applications = await getApplicationsByJob(jobId);

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getApplicationsByCandidateController = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required.",
      });
    }

    const applications = await getApplicationsByCandidate(candidateId);

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplicationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, recruiter_notes, interview_date } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values are: ${VALID_STATUS.join(", ")}`,
      });
    }

    const updateData = {
      status,
      recruiter_notes,
      interview_date,
    };

    const application = await updateApplicationStatus(id, updateData);

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
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

const deleteApplicationController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required.",
      });
    }

    const deletedApplication = await deleteApplication(id);

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
      data: deletedApplication,
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
  getApplicationsByJobController,
  getApplicationsByCandidateController,
  updateApplicationStatusController,
  deleteApplicationController,
};