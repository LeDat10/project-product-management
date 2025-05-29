import apiClient, { ApiError } from "./apiClient";
import axios, { AxiosResponse } from "axios";

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
  email: string;
  password: string;
}

export interface ResetPasswordData {
  newPassword: string;
  token: string;
}

export interface UserResponse {
  code: number;
  message: string;
  user?: any;
  token?: string;
  cartId?: string;
  tokenReset?: string;
}

const register = async (
  userData: RegisterData
): Promise<UserResponse | ApiError> => {
  const response = apiClient.post<UserResponse, RegisterData>(
    `/users/register`,
    userData
  );
  return (await response).data;
};

const login = async (
  loginData: LoginData
): Promise<UserResponse | ApiError> => {
  const response = await apiClient.post<UserResponse, LoginData>(
    `/users/login`,
    loginData
  );
  return response.data;
};

const confirmOTP = async (
  otpData: ConfirmOTPData
): Promise<UserResponse | ApiError> => {
  const response = apiClient.post<UserResponse, ConfirmOTPData>(
    `/users/register/confirm`,
    otpData
  );
  return (await response).data;
};

const forgotPassword = async (
  email: string
): Promise<UserResponse | ApiError> => {
  const response = apiClient.post<UserResponse, { email: string }>(
    `/users/password/forgot`,
    { email }
  );
  return (await response).data;
};

const otpPassword = async (
  otpData: ConfirmOTPData
): Promise<UserResponse | ApiError> => {
  const response = apiClient.post<UserResponse, ConfirmOTPData>(
    `/users/password/otp`,
    otpData
  );
  return (await response).data;
};

const resetPassword = async (
  passwordData: ResetPasswordData
): Promise<UserResponse | ApiError> => {
  const response = apiClient.post<UserResponse, ResetPasswordData>(
    `/users/password/reset`,
    passwordData
  );
  return (await response).data;
};

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
}

const updateProfile = async (
  profileData: UpdateProfileData,
  token: string
): Promise<UserResponse | ApiError> => {
  return apiClient.patch<UserResponse, UpdateProfileData>(
    `/users/edit`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const userService = {  getUserData: async (token: string): Promise<UserResponse> => {
    const response = await axios.get(`/users/info`, {
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
  updateProfile,
  getUserData: userService.getUserData,
};
