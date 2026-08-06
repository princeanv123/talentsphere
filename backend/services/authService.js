const loginUser = async (email, password) => {
  return {
    success: true,
    message: "Login API Working",
    recruiter: {
      email,
    },
  };
};

module.exports = {
  loginUser,
};