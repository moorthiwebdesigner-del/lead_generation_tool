import axios from "axios";

const api = axios.create({
  baseURL: "https://lead-generation-api-2sny.onrender.com",
});

export default api;