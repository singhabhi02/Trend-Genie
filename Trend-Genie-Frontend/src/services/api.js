import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Node.js Backend URL
});

// Auth APIs
export const signup = (userData) => API.post("/auth/signup", userData);
export const login = (userData) => API.post("/auth/login", userData);
export const forgotPassword = (email) => API.post("/auth/send-otp", { email });
export const resetPassword = (email, otp, newPassword) =>
  API.post("/auth/reset-password", { email, otp, newPassword });

// ✅ Google Login API
export const googleLogin = (credential) =>
  API.post("/auth/google-login", { credential });

// **New Recommendation API**
export const getRecommendations = (query) =>
  API.get(`/recommend?query=${query}`);

export default API;
