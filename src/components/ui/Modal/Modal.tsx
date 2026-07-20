import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: string | number;
  className?: string;
  headerContent?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  maxWidth,
  className = '',
  headerContent,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = `modal-container--${size}`;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal-container ${sizeClass} ${className}`}
        style={maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : undefined}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={typeof title === 'string' ? 'modal-title' : undefined}
      >
        {/* Header */}
        {(title || headerContent) && (
          <div className="modal-container__header">
            {headerContent || (
              <h2 id="modal-title" className="modal-container__title">
                {title}
              </h2>
            )}
            <button
              type="button"
              className="modal-container__close-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="modal-container__body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-container__footer">{footer}</div>}
      </div>
    </div>
  );
};
