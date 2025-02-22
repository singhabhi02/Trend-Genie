import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import aiBackground from "../assets/ai-background.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    try {
      const response = await login(formData);
      // Assuming the API returns user data along with token
      const userData = {
        token: response.data.token,
        email: formData.email,
        name: formData.name,
        // Add other user info if returned by the API (e.g., name)
      };
      console.log(userData)
      
      localStorage.setItem("loggedInUser", JSON.stringify(userData)); // Store user data
      
      console.log('Login successful, redirecting to /chat');
      navigate("/chat");
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
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;