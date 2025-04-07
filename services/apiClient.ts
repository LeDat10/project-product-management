import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = "https://api-project-product-management.vercel.app/api";

export interface ApiError {
  code?: number;
  message: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Thêm interceptor để debug request và response
apiClient.interceptors.request.use(
  (config) => {
    console.log("Request Config:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("Response Interceptor:", response);
    return response;
  },
  (error) => {
    console.error("Response Error Interceptor:", error);
    return Promise.reject(error);
  }
);

const post = async <T, U>(
  path: string,
  data?: U,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.post<T>(path, data, config);
    return response; // trả về toàn bộ AxiosResponse
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const get = async <T>(
  path: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response = await apiClient.get<T>(path, { ...config, params });
    return response;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const patch = async <T, U>(
  path: string,
  data?: U,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.patch<T>(path, data, config);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

const del = async <T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> => {
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
      message: error.response.data.message || "Lỗi từ server",
    };
  } else if (error.request) {
    return { message: "Không thể kết nối đến server" };
  } else {
    return { message: error.message || "Lỗi không xác định" };
  }
};

export default {
  post,
  get,
  patch,
  delete: del,
};
