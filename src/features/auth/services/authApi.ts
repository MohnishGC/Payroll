import type { LoginCredentials, AuthResponse, AuthUser } from '../types/auth.types';
import { USE_MOCK_API } from '../../../constants/config';
import { httpClient } from '../../../lib/http/httpClient';

interface LoginApiResponse {
  token: string;
  user_data: {
    id: string;
    email: string;
    employee_id?: string;
    employee_code?: string;
    userrole?: string;
  };
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!USE_MOCK_API) {
      try {
        const res = await httpClient.post<LoginApiResponse>('/api/auth/login', {
          username: credentials.username,
          password: credentials.password,
        });

        // Map backend's id and email to the local AuthUser structure
        const user: AuthUser = {
          id: res.user_data.id,
          username: res.user_data.email,
          name: res.user_data.email.split('@')[0], // Fallback name
          role: res.user_data.userrole || 'Payroll Administrator', // Default role
          employeeId: res.user_data.employee_id,
          employeeCode: res.user_data.employee_code,
        };

        return {
          success: true,
          message: 'Signed in successfully! Welcome to Timee.',
          token: res.token,
          user,
        };
      } catch (err: unknown) {
        const errorObj = err as Error;
        if (errorObj.message?.includes('Failed to fetch')) {
          throw new Error('Server unreachable. Please try again later.');
        }
        throw new Error(errorObj.message || 'Invalid username or password credentials.');
      }
    }

    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username.trim().toLowerCase() === 'admin' && credentials.password === 'error123') {
          reject(new Error('Invalid username or password credentials.'));
        } else {
          resolve({
            success: true,
            message: 'Signed in successfully! Welcome to Timee.',
            token: 'mock-jwt-token-timee-pms-2026',
            user: {
              id: 'usr-101',
              username: credentials.username,
              name: 'Alex Morgan',
              role: 'Payroll Administrator',
              employeeId: 'emp-101',
              employeeCode: 'SYS-ADMIN',
            },
          });
        }
      }, 1200);
    });
  },

  async logout(): Promise<AuthResponse> {
    if (!USE_MOCK_API) {
      try {
        const res = await httpClient.post<{ message?: string }>('/api/auth/logout');
        return {
          success: true,
          message: res.message || 'Logged out successfully',
        };
      } catch (err: unknown) {
        console.error('API logout request failed:', err);
        return {
          success: false,
          message: 'Logout API call failed, session terminated locally.',
        };
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Logged out successfully',
        });
      }, 500);
    });
  },

  async sendOtp(username: string, userCaptcha: string, generatedCaptcha: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userCaptcha.toUpperCase() !== generatedCaptcha.toUpperCase()) {
          reject(new Error('Invalid captcha code entered. Please try again.'));
          return;
        }

        if (!username.trim()) {
          reject(new Error('Username is required to send OTP.'));
          return;
        }

        resolve({
          success: true,
          message: `OTP sent successfully to the registered account for ${username}.`,
        });
      }, 1000);
    });
  },

  async verifyOtp(username: string, otpCode: string): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otpCode.length < 6 || otpCode.includes(' ')) {
          reject(new Error('Please enter a complete 6-digit OTP code.'));
          return;
        }

        if (otpCode === '000000') {
          reject(new Error('Invalid or expired OTP code. Please request a new code.'));
          return;
        }

        resolve({
          success: true,
          message: `OTP verified successfully for ${username}! Redirecting to login...`,
        });
      }, 1000);
    });
  },
};
