import axios from "axios";
import { clearLocalStorage } from "../utils";

export const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const api2 = axios.create({
    baseURL: 'http://localhost:5001/api/v1',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async function (config) {
        const token = localStorage.getItem("accessToken");
        
        if (token) {
          config.headers['authorization'] = `Bearer ${token}`;
        }
        config.params = {
            ...config.params,
        };
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response.data;
    },
    function (error) {
        if (error.response) {
            if (error.response.status === 403) {
                clearLocalStorage();
            }
            if (error.response.status === 401) {
                clearLocalStorage();
            }
        }

        return Promise.reject(error);
    },
);
