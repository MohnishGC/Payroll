import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import type { IconName } from '../../icons/icon-registry';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconName?: IconName;
  error?: string;
  id: string;
  variant?: 'default' | 'borderless';
}

export const Input: React.FC<InputProps> = ({
  label,
  iconName,
  error,
  id,
  variant = 'default',
  className = '',
  disabled,
  ...props
}) => {
  const hasError = Boolean(error);
  const errorId = `${id}-error`;

  return (
    <div
      className={`input-group ${
        variant === 'borderless' ? 'input-group--borderless' : ''
      } ${hasError ? 'input-group--error' : ''} ${className}`}
    >
      {label && (
        <label htmlFor={id} className="input-group__label">
          {label}
        </label>
      )}
      <div className="input-group__field-wrapper">
        {iconName && (
          <span className="input-group__icon">
            <Icon name={iconName} size={18} />
          </span>
        )}
        <input
          id={id}
          className={`input-group__field ${
            iconName ? 'input-group__field--has-icon' : ''
          }`}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          {...props}
        />
      </div>
      {hasError && (
        <p id={errorId} className="input-group__error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
