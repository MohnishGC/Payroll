import React, { useRef } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import './OtpInput.css';

export interface OtpInputProps {
  value: string[];
  onChange: (index: number, val: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  error = false,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(index, val);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{1,6}$/.test(pastedData)) {
      onChange(0, pastedData);
      const focusIdx = Math.min(pastedData.length, 5);
      inputRefs.current[focusIdx]?.focus();
    }
  };

  return (
    <div className={`otp-container ${error ? 'otp-container--error' : ''}`}>
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={index === 0 ? 6 : 1}
          value={value[index] || ''}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="otp-container__box"
          aria-label={`Digit ${index + 1} of 6`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};
