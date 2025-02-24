import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import aiBackground from "../assets/ai-background.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Add confirmPassword field
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return; // Stop the function if passwords don't match
    }

    try {
      const response = await signup(formData);
      const userData = {
        token: response.data.token,
        name: formData.name,
        email: formData.email,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(userData)); // Store user data
      navigate("/chat");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${aiBackground})` }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Sign Up
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>
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
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-white">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword" // Add name attribute for confirmPassword
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-800 text-white placeholder-gray-400"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Already have an account?{" "}
          <a href="/" className="text-blue-400 hover:text-blue-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;