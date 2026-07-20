import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  loadingText,
  disabled,
  className = '',
  type = 'button',
  ...props
}) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full-width' : ''} ${
        isLoading ? 'btn--loading' : ''
      } ${className}`}
      disabled={isButtonDisabled}
      {...props}
    >
      {isLoading ? (
        <span className="btn__loading-content">
          <Icon name="spinner" size={18} className="btn__spinner" />
          <span>{loadingText || children}</span>
        </span>
      ) : (
        <span className="btn__content">{children}</span>
      )}
    </button>
  );
};
