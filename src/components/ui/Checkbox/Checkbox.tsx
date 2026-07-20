import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '../../icons/Icon';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  checked,
  className = '',
  ...props
}) => {
  return (
    <label htmlFor={id} className={`checkbox-group ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        className="checkbox-group__input"
        {...props}
      />
      <span className="checkbox-group__box">
        {checked && <Icon name="check" size={14} className="checkbox-group__check-icon" />}
      </span>
      <span className="checkbox-group__label-text">{label}</span>
    </label>
  );
};
