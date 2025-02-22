import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // Backend URL
});

//Signup API
export const signup = (userData) => API.post("/signup", userData);

//Login API
export const login = (userData) => API.post("/login", userData);
export const getTrends = () => API.get("/trends");

export default API;
