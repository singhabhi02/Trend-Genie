import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api"; // Import the login API
import aiBackground from "../assets/ai-background.jpg"; // Import the background image

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use the navigate hook from react-router-dom

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData); // Call the login API
      // console.log(response, login(formData),  "response");
      // localStorage.removeItem("token"); // Clear old token
      localStorage.setItem("token", response.data.token); // Save the new token
      console.log('Login successful, redirecting to /chat'); // Debugging
      navigate("/chat") // Redirect to chat page
    } catch (error) {
      setError(error.response?.data?.message || "Login failed"); // Handle errors
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${aiBackground})` }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
