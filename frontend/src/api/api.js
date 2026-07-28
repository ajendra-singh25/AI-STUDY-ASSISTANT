import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-study-assistant-boc3.onrender.com/api",
});

export default api;