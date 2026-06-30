import axios from "axios";
import { customerAuthToken } from "../../Admin/features/CustomerDashboard/services/AuthService/AuthService";

const userAxiosApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
});

userAxiosApi.interceptors.request.use(
  (config) => {
    let userToken = localStorage.getItem(customerAuthToken);
    let parseToken = userToken ? JSON.parse(userToken) : "";

    if (parseToken) {
      config.headers["Accept"] = "application/vnd.api+json";
      config.headers["Authorization"] = `Bearer ${parseToken}`;
      config.headers["Content-Type"] = "application/vnd.api+json";
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

userAxiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = await refreshAccessToken();

        error.config.headers.Authorization = `Bearer  ${refreshToken}`;

        return userAxiosApi.request(error.config);
      } catch (refreshError) {
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const response = await userAxiosApi.post("/api/v1/auth/refresh-token", {});

    const newToken = response.data.token;

    return newToken;
  } catch (error) {
    throw error;
  }
};


export { userAxiosApi };