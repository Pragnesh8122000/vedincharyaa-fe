import { useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useToast } from '../../providers/ToastProvider';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const AxiosInterceptor: React.FC = () => {
    const { showToast } = useToast();

    useEffect(() => {
        const reqInterceptor = apiClient.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => config,
            (error: AxiosError) => Promise.reject(error)
        );

        const resInterceptor = apiClient.interceptors.response.use(
            (response: AxiosResponse) => {
                // Determine if this is a mutation (not GET)
                const isMutation = response.config.method !== 'get' && response.config.method !== 'GET';

                // Backend standard response: { success, message, data }
                // Frontend API client usually unwraps to response.data.data
                // But the interceptor sees the FULL response object.
                // response.data is { success, message, data }

                if (isMutation && response.data?.message) {
                    showToast(response.data.message, 'success');
                }

                return response;
            },
            (error: AxiosError<any>) => {
                const errorMessage = error.response?.data?.message || 'An unknown error occurred';
                showToast(errorMessage, 'error');
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.request.eject(reqInterceptor);
            apiClient.interceptors.response.eject(resInterceptor);
        };
    }, [showToast]);

    return null;
};

export default AxiosInterceptor;
