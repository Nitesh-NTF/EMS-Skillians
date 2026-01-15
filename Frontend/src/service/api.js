import axios from "axios"
import { store } from "../store";
import { logout } from "../store/authSlice";

export const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config;

    // Prevent infinite loop
    if (status === 401 ) {
      originalRequest._retry = true;

      // Logout user
      store.dispatch(logout());

      // Redirect to login
      window.location.href = "/login";
    }
    console.log('error', error)
    return Promise.reject(error);
  }
);
