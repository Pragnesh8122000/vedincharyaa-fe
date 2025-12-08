import { apiClient } from './client';

export const signup = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
};

export const login = async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
};
