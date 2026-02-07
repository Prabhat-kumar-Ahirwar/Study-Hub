import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token only for protected routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/send-otp",
    ];

    const isPublic = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
