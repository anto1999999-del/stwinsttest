// /root/s-twins/s-twins-web/src/shared/api/instance.ts
import axios, { AxiosHeaders } from "axios";

// Route all API calls through Next.js, which rewrites /api/* -> BACKEND_URL/api/*
export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // important if you rely on cookies/sessions
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  // Only attach admin token to sensitive routes
  const url = config.url ?? "";
  const needsAuth =
    url.startsWith("/admin") ||
    url.startsWith("admin") ||
    url.startsWith("/orders") ||
    url.startsWith("orders");

  if (needsAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) {
      const headers = new AxiosHeaders(config.headers ?? {});
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
  }

  return config;
});
