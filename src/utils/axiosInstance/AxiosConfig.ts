import axios from "axios";
import { authToken } from "../../api/services/AuthService";
import AuthService from "../../api/services/AuthService";

const axiosApi = axios.create({
  baseURL: `${import.meta.env.VITE_ADMIN_API_URL}`,
});

const readStoredToken = (): string => {
  try {
    const raw = localStorage.getItem(authToken);
    const parsed = raw ? JSON.parse(raw) : "";
    return parsed && parsed !== "undefined" ? parsed : "";
  } catch {
    return "";
  }
};

axiosApi.interceptors.request.use(
  (config) => {
    const token = readStoredToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config?._retry && !isRefreshing) {
      error.config._retry = true;
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        AuthService.saveLocalLoginInfo(newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosApi.request(error.config);
      } catch (refreshError) {
        AuthService.clearLoginToken();
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_ADMIN_API_URL}/api/v1/auth/refresh-token`,
    {},
    {
      headers: {
        Authorization: `Bearer ${readStoredToken()}`,
      },
    }
  );
  return response.data.token;
};

export default axiosApi;
