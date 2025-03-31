import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = 'https://api-project-product-management.vercel.app/api';

export interface ApiError {
  code?: number;
  message: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const post = async <T, U>(path: string, data?: U, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.post<T>(path, data, config);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const get = async <T>(path: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.get<T>(path, { ...config, params });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const patch = async <T, U>(path: string, data?: U, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.patch<T>(path, data, config);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const del = async <T>(path: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(path, config);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      code: error.response.status,
      message: error.response.data.message || 'Lỗi từ server',
    };
  } else if (error.request) {
    return { message: 'Không thể kết nối đến server' };
  } else {
    return { message: error.message || 'Lỗi không xác định' };
  }
};

export default {
  post,
  get,
  patch,
  delete: del,
};