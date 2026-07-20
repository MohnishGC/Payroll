import React, { useRef } from 'react';
import { Icon } from '../../icons/Icon';
import './AvatarUpload.css';

export interface AvatarUploadProps {
  previewUrl?: string | null;
  nameFallback?: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  previewUrl,
  nameFallback = 'Employee',
  onFileSelect,
  onRemove,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = nameFallback
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="avatar-upload">
      <div
        className="avatar-upload__preview-circle"
        onClick={() => !disabled && fileInputRef.current?.click()}
        title="Click to upload profile photo"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && fileInputRef.current?.click();
          }
        }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Employee Avatar" className="avatar-upload__img" />
        ) : (
          <span className="avatar-upload__initials">{initials || 'EM'}</span>
        )}

        <div className="avatar-upload__overlay">
          <Icon name="search" size={24} color="#FFFFFF" />
          <span className="avatar-upload__overlay-text">Upload</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="avatar-upload__input"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {previewUrl && (
        <button
          type="button"
          className="avatar-upload__remove-btn"
          onClick={onRemove}
          disabled={disabled}
        >
          Remove Photo
        </button>
      )}
    </div>
  );
};
