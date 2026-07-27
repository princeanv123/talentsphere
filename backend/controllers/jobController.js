const {
  createJob,
  getAllJobs,
} = require("../services/jobService");

const VALID_EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
];

const VALID_STATUS = [
  "Open",
  "Closed",
  "Draft",
];

const createJobController = async (req, res) => {
  try {
    let {
      title,
      company_name,
      department,
      location,
      employment_type,
      experience_required,
      description,
      status,
      created_by,
    } = req.body;

    // Trim inputs
    title = title?.trim();
    company_name = company_name?.trim();
    department = department?.trim();
    location = location?.trim();
    description = description?.trim();

    // Required fields validation
    if (!title || !company_name || !department || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title, Company Name, Department and Description are required.",
      });
    }

    // Experience validation
    if (
      experience_required != null &&
      Number(experience_required) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Experience cannot be negative.",
      });
    }

    // Employment Type validation
    if (employment_type) {
      employment_type = employment_type.trim().toLowerCase();

      if (!VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employment type.",
        });
      }

      // Normalize before saving
      employment_type = employment_type
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("-");
    }

    // Status validation
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const job = await createJob({
      title,
      company_name,
      department,
      location,
      employment_type,
      experience_required,
      description,
      status,
      created_by,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllJobsController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAllJobs(page, limit);

    return res.status(200).json({
      success: true,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      totalRecords: result.totalRecords,
      totalPages: result.totalPages,
      count: result.jobs.length,
      data: result.jobs,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createJobController,
  getAllJobsController,
};