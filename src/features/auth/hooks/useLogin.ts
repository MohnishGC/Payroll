import { useState } from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';
import { authApi } from '../services/authApi';
import type { LoginCredentials, LoginValidationErrors, AuthResponse } from '../types/auth.types';

export const useLogin = (onSuccessRedirect?: (response: AuthResponse) => void) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginValidationErrors>({});
  const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateField = (name: keyof LoginCredentials, value: string): string | undefined => {
    if (name === 'username') {
      if (!value.trim()) return 'Username is required';
    }
    if (name === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: LoginValidationErrors = {};
    const usernameErr = validateField('username', credentials.username);
    const passwordErr = validateField('password', credentials.password);

    if (usernameErr) newErrors.username = usernameErr;
    if (passwordErr) newErrors.password = passwordErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setCredentials((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (generalError) setGeneralError(null);

    // Live validation if already touched
    if (touched[name as keyof typeof touched] && type !== 'checkbox') {
      const err = validateField(name as keyof LoginCredentials, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof LoginCredentials, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setGeneralError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      setSuccessMessage(response.message);
      if (onSuccessRedirect) {
        onSuccessRedirect(response);
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setGeneralError(errorObj.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    errors,
    touched,
    isLoading,
    generalError,
    successMessage,
    handleChange,
    handleBlur,
    handleSubmit,
    setGeneralError,
  };
};
