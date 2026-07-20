import React from 'react';
import { iconRegistry } from './icon-registry';
import type { IconName } from './icon-registry';
import './Icon.css';

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const IconComponent = iconRegistry[name as keyof typeof iconRegistry];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry.`);
    return null;
  }

  return (
    <span
      className={`app-icon app-icon--${name} ${className}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <IconComponent size={size} color={color} />
    </span>
  );
};
