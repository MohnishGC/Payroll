export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginValidationErrors {
  username?: string;
  password?: string;
  general?: string;
}

export interface ForgotPasswordRequest {
  username: string;
  captchaInput: string;
}

export interface ForgotPasswordValidationErrors {
  username?: string;
  captchaInput?: string;
  otpCode?: string;
  general?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  employeeId?: string;
  employeeCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}
