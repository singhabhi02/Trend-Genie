import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Backend URL
});

export const login = (userData) => API.post("/api/login", userData);
export const signup = (userData) => API.post("/api/signup", userData);
export const getTrends = () => API.get("/api/trends");
