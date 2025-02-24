// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // Backend URL
});

// Signup API
export const signup = (userData) => API.post("/signup", userData);

// Login API
export const login = (userData) => API.post("/login", userData);

// Get Trends API (if used elsewhere)
export const getTrends = () => API.get("/trends");

// Send OTP API (matches backend /send-otp)
export const forgotPassword = (email) => API.post("/send-otp", { email });

// Reset Password API (matches backend /reset-password)
export const resetPassword = (email, otp, newPassword) =>
  API.post("/reset-password", { email, otp, newPassword });

export default API;
