import React from 'react';
import { Input } from '../../../components/ui/Input/Input';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { Icon } from '../../../components/icons/Icon';
import { CaptchaBox } from './CaptchaBox';
import { OtpInput } from './OtpInput';
import { useForgotPassword } from '../hooks/useForgotPassword';
import './ForgotPasswordForm.css';

export interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin,
}) => {
  const {
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
    setGeneralError,
  } = useForgotPassword(onBackToLogin);

  return (
    <div className="forgot-form">
      {/* Back Button */}
      <button
        type="button"
        className="forgot-form__back-btn"
        onClick={onBackToLogin}
        disabled={isLoading}
      >
        <Icon name="arrowLeft" size={16} />
        <span>Back to sign in</span>
      </button>

      {/* STEP 1: REQUEST OTP */}
      {step === 'request' && (
        <>
          <header className="forgot-form__header">
            <h1 className="forgot-form__title">
              Reset Password
              <span className="forgot-form__subtitle">Forgot your password?</span>
            </h1>
            <p className="forgot-form__subtext">
              Enter your registered username and security captcha below to receive a 6-digit verification code.
            </p>
          </header>

          {generalError && (
            <Alert
              type="error"
              message={generalError}
              onClose={() => setGeneralError(null)}
            />
          )}

          <form className="forgot-form__body" onSubmit={handleSendOtp} noValidate>
            <Input
              id="forgot-username"
              type="text"
              placeholder="Username"
              iconName="user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              disabled={isLoading}
              autoComplete="username"
            />

            {/* Captcha Section */}
            <div className="forgot-form__captcha-section">
              <label className="forgot-form__captcha-label">Security Captcha</label>
              <div className="forgot-form__captcha-row">
                <CaptchaBox code={generatedCaptcha} onRefresh={refreshCaptcha} />
                <Input
                  id="captcha-input"
                  type="text"
                  placeholder="Enter captcha code"
                  iconName="shield"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  error={errors.captchaInput}
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              loadingText="Sending OTP..."
              fullWidth
            >
              Send OTP Code
            </Button>
          </form>
        </>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 'verify' && (
        <>
          <header className="forgot-form__header">
            <h1 className="forgot-form__title">
              Verify OTP Code
              <span className="forgot-form__subtitle">Enter 6-Digit Code</span>
            </h1>
            <p className="forgot-form__subtext">
              We sent a 6-digit verification code to the account registered for{' '}
              <strong>{username}</strong>.
            </p>
          </header>

          {generalError && (
            <Alert
              type="error"
              message={generalError}
              onClose={() => setGeneralError(null)}
            />
          )}

          {successMessage && (
            <Alert type="success" message={successMessage} />
          )}

          <form className="forgot-form__body" onSubmit={handleVerifyOtp} noValidate>
            <div className="forgot-form__otp-wrapper">
              <label className="forgot-form__otp-label">Enter 6-Digit OTP</label>
              <OtpInput
                value={otpCode}
                onChange={handleOtpChange}
                error={Boolean(errors.otpCode)}
                disabled={isLoading}
              />
              {errors.otpCode && (
                <p className="forgot-form__error-text">{errors.otpCode}</p>
              )}
            </div>

            <div className="forgot-form__resend-row">
              {canResend ? (
                <button
                  type="button"
                  className="forgot-form__resend-btn"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Resend OTP Code
                </button>
              ) : (
                <span className="forgot-form__timer-text">
                  Resend code available in <strong>{timer}s</strong>
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              loadingText="Verifying..."
              fullWidth
            >
              Verify OTP & Continue
            </Button>
          </form>
        </>
      )}

      {/* STEP 3: SUCCESS */}
      {step === 'success' && (
        <div className="forgot-form__success-box">
          <div className="forgot-form__success-icon-badge">
            <Icon name="checkCircle" size={48} color="#10B981" />
          </div>
          <h2 className="forgot-form__success-title">OTP Verified Successfully!</h2>
          <p className="forgot-form__success-text">
            Your verification was completed. Redirecting you back to the sign-in screen...
          </p>
          <Button variant="primary" fullWidth onClick={onBackToLogin}>
            Return to Sign in Now
          </Button>
        </div>
      )}
    </div>
  );
};
