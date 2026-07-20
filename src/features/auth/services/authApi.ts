import type { LoginCredentials, AuthResponse } from '../types/auth.types';

// Mock authentication API simulating asynchronous network calls
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock check
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
            },
          });
        }
      }, 1200);
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
