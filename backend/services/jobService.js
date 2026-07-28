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

const getAllJobs = async (
  page = 1,
  limit = 10,
  search = "",
  department = "",
  employment_type = "",
  status = ""
) => {
  page = Number(page);
  limit = Number(limit);

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let countQuery = supabase
    .from("jobs")
    .select("*", { count: "exact", head: true });

  let dataQuery = supabase
    .from("jobs")
    .select("*");

  // Keyword Search
  if (search.trim()) {
    const keyword = search.trim();

    countQuery = countQuery.or(
      `title.ilike.%${keyword}%,company_name.ilike.%${keyword}%,department.ilike.%${keyword}%,location.ilike.%${keyword}%`
    );

    dataQuery = dataQuery.or(
      `title.ilike.%${keyword}%,company_name.ilike.%${keyword}%,department.ilike.%${keyword}%,location.ilike.%${keyword}%`
    );
  }

  // Department Filter
  if (department.trim()) {
    countQuery = countQuery.eq("department", department.trim());
    dataQuery = dataQuery.eq("department", department.trim());
  }

  // Employment Type Filter
  if (employment_type.trim()) {
    countQuery = countQuery.eq(
      "employment_type",
      employment_type.trim()
    );

    dataQuery = dataQuery.eq(
      "employment_type",
      employment_type.trim()
    );
  }

  // Status Filter
  if (status.trim()) {
    countQuery = countQuery.eq("status", status.trim());
    dataQuery = dataQuery.eq("status", status.trim());
  }

  // Count
  const { count, error: countError } = await countQuery;

  if (countError) {
    throw new Error(countError.message);
  }

  // Data
  const { data, error } = await dataQuery
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

const getJobById = async (jobId) => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Job not found");
  }

  return data;
};
const updateJob = async (jobId, jobData) => {
  const { data, error } = await supabase
    .from("jobs")
    .update(jobData)
    .eq("id", jobId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Job not found");
  }

  return data;
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
};