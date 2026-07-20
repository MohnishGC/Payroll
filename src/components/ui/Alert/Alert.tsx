import React from 'react';
import { Icon } from '../../icons/Icon';
import './Alert.css';

export interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  message,
  className = '',
  onClose,
}) => {
  const iconMap = {
    error: 'alertCircle' as const,
    success: 'checkCircle' as const,
    warning: 'alertCircle' as const,
    info: 'alertCircle' as const,
  };

  return (
    <div className={`alert alert--${type} ${className}`} role="alert">
      <span className="alert__icon">
        <Icon name={iconMap[type]} size={18} />
      </span>
      <span className="alert__message">{message}</span>
      {onClose && (
        <button
          type="button"
          className="alert__close"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  );
};
