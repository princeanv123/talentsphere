import { useState } from "react";
import Logo from "../layouts/Logo";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import RememberMe from "./RememberMe";
import SocialLogin from "./SocialLogin";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await login(email, password);

      console.log("Login Response:", response);

      if (response.success) {
        localStorage.setItem(
          "recruiter",
          JSON.stringify(response.recruiter)
        );

        navigate("/dashboard");
      } else {
        alert(response.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-12 transition duration-300 hover:shadow-red-200">

        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Welcome Back
          </h2>

          <p className="mt-3 text-gray-500 text-lg">
            Sign in to continue to TalentSphere
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <EmailInput
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={errors.email}
          />

          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            error={errors.password}
          />

          <RememberMe />

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-16 rounded-xl text-white text-lg font-semibold transition-all duration-300 shadow-md ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <SocialLogin />

        <div className="mt-8 text-center text-sm text-gray-400">
          © 2026 TalentSphere Built by Prince Singh
        </div>

      </div>
    </div>
  );
}
