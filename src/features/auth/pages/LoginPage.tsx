import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../../components/layout/AuthLayout/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { useAuth } from '../../../app/providers/AuthProvider';
import type { AuthResponse } from '../types/auth.types';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot-password'>('login');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = (response: AuthResponse) => {
    if (response.user && response.token) {
      login(response.user, response.token);
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout>
      <div className="login-page">
        {view === 'login' ? (
          <LoginForm
            onForgotPasswordClick={() => setView('forgot-password')}
            onSuccess={handleLoginSuccess}
          />
        ) : (
          <ForgotPasswordForm
            onBackToLogin={() => setView('login')}
          />
        )}
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
