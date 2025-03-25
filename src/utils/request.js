import axios from "axios";
import Cookies from "js-cookie";

const API_DOMAIN = "http://localhost:5000/api/";

const axiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

const EXCLUDED_URLS = [
    "accounts/login"
];

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    // Kiểm tra URL có trong danh sách loại trừ không
    const isExcluded = EXCLUDED_URLS.some((url) => config.url.includes(url));

    if (token && !isExcluded) {
        config.headers.authorization = `Bearer ${token}`;
    };

    return config;
});

export const get = async (path) => {
    const response = await axiosInstance.get(API_DOMAIN + path);
    const result = response.data;
    return result;
};

export const patch = async (path, option) => {
    const response = await axiosInstance.patch(API_DOMAIN + path, option);
    const result = response.data;
    return result;
};

export const del = async (path) => {
    const response = await axiosInstance.delete(API_DOMAIN + path);
    const result = response.data;
    return result;
};

export const post = async (path, option) => {
    const response = await axiosInstance.post(API_DOMAIN + path, option);
    const result = response.data;
    return result;
};