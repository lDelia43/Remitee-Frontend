import axios from "axios";
import type { ApiProblem } from "@/types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const problem: ApiProblem = {
      title: error.response?.data?.title || error.message || "Request failed",
      status: error.response?.status || 500,
    };
    return Promise.reject({ ...error, problem });
  }
);

export default apiClient;
