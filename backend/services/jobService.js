const supabase = require("../config/supabase");

const createJob = async (jobData) => {
  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getAllJobs = async (page = 1, limit = 10) => {
  page = Number(page);
  limit = Number(limit);

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Get total number of jobs
  const { count, error: countError } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  // Get paginated jobs
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  return {
    jobs: data,
    totalRecords: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    pageSize: limit,
  };
};

module.exports = {
  createJob,
  getAllJobs,
};