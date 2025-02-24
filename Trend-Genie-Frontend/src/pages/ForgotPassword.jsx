// src/components/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import aiBackground from "../assets/ai-background.png";
import { forgotPassword } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email); // Calls /send-otp
      setMessage(response.data.message);
      setStep(2); // Switch to OTP entry
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Handle OTP submission
  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      setMessage("OTP submitted, redirecting...");
      // Navigate to reset-password with email and OTP; verification happens on backend
      navigate("/reset-password", { state: { email, otp } });
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${aiBackground})` }}
    >
      <h1 className="absolute top-4 left-4 text-3xl font-bold text-white">
        Trend-Genie
      </h1>
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Forgot Password
        </h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-white">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
                placeholder="Enter the OTP"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Submit OTP
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-white">
          Remember your password?{" "}
          <a href="/" className="text-blue-400 hover:text-blue-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;