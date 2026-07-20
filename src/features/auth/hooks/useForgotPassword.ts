import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/authApi';
import type { ForgotPasswordValidationErrors } from '../types/auth.types';

export const generateCaptchaText = (): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useForgotPassword = (onSuccessVerify?: () => void) => {
  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [username, setUsername] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''));

  const [errors, setErrors] = useState<ForgotPasswordValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timer for OTP resend
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  const refreshCaptcha = useCallback(() => {
    setGeneratedCaptcha(generateCaptchaText());
    setCaptchaInput('');
    setErrors((prev) => ({ ...prev, captchaInput: undefined }));
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  // Handle resend countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const newErrors: ForgotPasswordValidationErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!captchaInput.trim()) {
      newErrors.captchaInput = 'Captcha is required';
    } else if (captchaInput.trim().toUpperCase() !== generatedCaptcha.toUpperCase()) {
      newErrors.captchaInput = 'Captcha code does not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.sendOtp(username, captchaInput, generatedCaptcha);
      setSuccessMessage(response.message);
      setStep('verify');
      setTimer(30);
      setCanResend(false);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setGeneralError(errorObj.message || 'Failed to send OTP.');
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otpCode];
      pasted.forEach((char, idx) => {
        if (idx < 6 && /^\d$/.test(char)) {
          newOtp[idx] = char;
        }
      });
      setOtpCode(newOtp);
      return;
    }

    if (value !== '' && !/^\d$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (errors.otpCode) {
      setErrors((prev) => ({ ...prev, otpCode: undefined }));
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const fullCode = otpCode.join('');

    if (fullCode.length < 6 || otpCode.some((val) => val === '')) {
      setErrors({ otpCode: 'Please enter all 6 OTP digits' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(username, fullCode);
      setSuccessMessage(response.message);
      setStep('success');

      // Redirect back after delay
      setTimeout(() => {
        if (onSuccessVerify) {
          onSuccessVerify();
        }
      }, 2000);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setGeneralError(errorObj.message || 'Failed to verify OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setGeneralError(null);
    setIsLoading(true);
    try {
      await authApi.sendOtp(username, generatedCaptcha, generatedCaptcha);
      setSuccessMessage('A new OTP has been sent to your registered account.');
      setTimer(30);
      setCanResend(false);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setGeneralError(errorObj.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    username,
    setUsername,
    captchaInput,
    setCaptchaInput,
    generatedCaptcha,
    otpCode,
    timer,
    canResend,
    errors,
    isLoading,
    generalError,
    successMessage,
    refreshCaptcha,
    handleSendOtp,
    handleOtpChange,
    handleVerifyOtp,
    handleResendOtp,
    setStep,
    setGeneralError,
  };
};
