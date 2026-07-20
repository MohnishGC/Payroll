import React from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { AuthIllustration } from '../../../features/auth/components/AuthIllustration';
import './AuthLayout.css';

export interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="auth-layout">
      <div className="auth-card">
        {/* LEFT PANEL - Brand Panel */}
        <section className="auth-card__brand">
          {/* Top-Left Logo */}
          <div className="auth-card__logo">
            <span className="auth-card__logo-icon">
              <Icon name="clock" size={22} color="#FFFFFF" aria-label="Timee Logo" />
            </span>
            <span className="auth-card__logo-text">PAYROLL</span>
          </div>

          {/* Center Illustration */}
          <div className="auth-card__illustration-wrapper">
            <AuthIllustration />
          </div>

          {/* Bottom Tagline */}
          <p className="auth-card__tagline">Because every second matters.</p>
        </section>

        {/* RIGHT PANEL - Form Panel */}
        <section className="auth-card__form-wrapper">
          {children}
        </section>
      </div>
    </main>
  );
};
