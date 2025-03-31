import apiClient, { ApiError} from './apiClient';
import axios from 'axios';

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface ConfirmOTPData {
  email: string;
  otp: string;
}

export interface LoginData {
  userName: string;
  password: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface UserResponse {
  code: number;
  message: string;
  user?: any;
  token?: string;
  cartId?: string;
}

const register = async (userData: RegisterData): Promise<UserResponse | ApiError> => {
  return apiClient.post<UserResponse, RegisterData>(`/register`, userData);
};

const confirmOTP = async (otpData: ConfirmOTPData): Promise<UserResponse | ApiError> => {
  return apiClient.post<UserResponse, ConfirmOTPData>(`/register/confirmOTP`, otpData);
};

const login = async (loginData: LoginData): Promise<UserResponse | ApiError> => {
  return apiClient.post<UserResponse, LoginData>(`/login`, loginData);
};

const forgotPassword = async (email: string): Promise<UserResponse | ApiError> => {
  return apiClient.post<UserResponse, { email: string }>(`/password/forgot`, { email });
};

const otpPassword = async (otpData: ConfirmOTPData): Promise<UserResponse | ApiError> => {
  return apiClient.post<UserResponse, ConfirmOTPData>(`/password/otp`, otpData);
};

const resetPassword = async (passwordData: ResetPasswordData, token: string): Promise<UserResponse | ApiError> => {
  return apiClient.post<UserResponse, ResetPasswordData>(`/password/reset`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const userService = {
  getUserData: async (token: string): Promise<UserResponse> => {
    const response = await axios.get(`/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default {
  register,
  confirmOTP,
  login,
  forgotPassword,
  otpPassword,
  resetPassword,
  getUserData: userService.getUserData,
};