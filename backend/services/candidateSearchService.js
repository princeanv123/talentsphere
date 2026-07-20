const supabase = require("../config/supabase");

const getAllCandidates = async () => {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const searchCandidates = async ({
  keyword,
  location,
  experience,
}) => {
  let query = supabase
    .from("candidates")
    .select("*");

  if (keyword) {
    query = query.or(
      `full_name.ilike.%${keyword}%,email.ilike.%${keyword}%`
    );
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (experience) {
    query = query.gte("experience", experience);
  }

  const { data, error } = await query.order("experience", {
    ascending: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
console.log({
  getAllCandidates,
  searchCandidates,
});
module.exports = {
  getAllCandidates,
  searchCandidates,
};