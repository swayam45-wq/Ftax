import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // Send cookies for refresh token
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — attach access token ────────────────────────────────

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response Interceptor — auto-refresh on 401 ───────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((req) => {
    if (error) req.reject(error);
    else req.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post('/auth/refresh');
        const newToken = data.accessToken;
        localStorage.setItem('access_token', newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── API Functions ────────────────────────────────────────────────────────────

export const authApi = {
  sendOtp: (email: string) =>
    apiClient.post<{ message: string }>('/auth/send-otp', { email }),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post<{ message: string; otpToken: string }>('/auth/verify-otp', { email, otp }),

  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiClient.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<{ accessToken: string; message: string }>('/auth/login', data),

  logout: () => apiClient.post('/auth/logout'),

  refresh: () => apiClient.post<{ accessToken: string }>('/auth/refresh'),

  me: () => apiClient.get('/auth/me'),

  verifyEmail: (token: string) => apiClient.get(`/auth/verify-email?token=${token}`),

  resendVerification: (email: string) =>
    apiClient.post('/auth/resend-verification', { email }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
};

export const profileApi = {
  get: () => apiClient.get('/profile'),
  update: (data: Record<string, unknown>) => apiClient.put('/profile', data),
  addTravel: (data: Record<string, unknown>) => apiClient.post('/profile/travel', data),
  getTravel: () => apiClient.get('/profile/travel'),
  deleteTravel: (id: string) => apiClient.delete(`/profile/travel/${id}`),
};

export const taxApi = {
  checkResidency: (data: Record<string, unknown>) =>
    apiClient.post('/tax/residency-check', data),
  getCurrentRules: () => apiClient.get('/tax/rules/current'),
};
