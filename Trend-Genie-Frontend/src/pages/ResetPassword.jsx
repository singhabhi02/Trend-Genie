// src/components/ResetPassword.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import aiBackground from "../assets/ai-background.png";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {}; // Get email and OTP from navigation state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword(email, otp, newPassword); // Calls /reset-password
      setMessage(response.data.message);
      setTimeout(() => navigate("/"), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password");
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
          Reset Password
        </h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-white">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              placeholder="Confirm new password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;