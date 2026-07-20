import React from 'react';
import { Input } from '../../../components/ui/Input/Input';
import { Checkbox } from '../../../components/ui/Checkbox/Checkbox';
import { Button } from '../../../components/ui/Button/Button';
import { Alert } from '../../../components/ui/Alert/Alert';
import { useLogin } from '../hooks/useLogin';
import type { AuthResponse } from '../types/auth.types';
import './LoginForm.css';

export interface LoginFormProps {
  onForgotPasswordClick: () => void;
  onSuccess?: (response: AuthResponse) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPasswordClick,
  onSuccess,
}) => {
  const {
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
  } = useLogin(onSuccess);

  return (
    <div className="login-form">
      {/* Header Section */}
      <header className="login-form__header">
        <h1 className="login-form__title">
          Good morning!
          <span className="login-form__subtitle">Sign in to Timee</span>
        </h1>
        <p className="login-form__subtext">
          You need to provide an access details below to enter the system.
        </p>
      </header>

      {/* Alert Notification Banners */}
      {generalError && (
        <Alert
          type="error"
          message={generalError}
          className="login-form__alert"
          onClose={() => setGeneralError(null)}
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          className="login-form__alert"
        />
      )}

      {/* Form Fields */}
      <form className="login-form__body" onSubmit={handleSubmit} noValidate>
        <div className="login-form__inputs">
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            iconName="user"
            value={credentials.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username ? errors.username : undefined}
            disabled={isLoading}
            autoComplete="username"
          />

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            iconName="lock"
            value={credentials.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        {/* Form Action Controls */}
        <div className="login-form__actions-row">
          <div className="login-form__remember-me">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              label="Remember me"
              checked={credentials.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <button
            type="button"
            className="login-form__forgot-link"
            onClick={onForgotPasswordClick}
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <div className="login-form__submit-wrapper">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            loadingText="Signing in..."
            fullWidth
          >
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
};
