import React, { useRef, useState } from 'react';
import { Icon } from '../../icons/Icon';
import './FileUpload.css';

export interface UploadedFileItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  docType: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  fileUrl?: string;
  uploadedDate?: string;
}

export interface FileUploadProps {
  files: UploadedFileItem[];
  onAddFiles: (newFiles: File[]) => void;
  onRemoveFile: (id: string) => void;
  onDocTypeChange: (id: string, docType: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  onDocTypeChange,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
    }
  };

  const formatFileSize = (item: UploadedFileItem): string => {
    if (!item.file && item.fileUrl) {
      return 'Uploaded';
    }
    const bytes = item.size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload">
      {/* Drop-Zone Area */}
      <div
        className={`file-upload__dropzone ${isDragOver ? 'file-upload__dropzone--drag-over' : ''} ${
          disabled ? 'file-upload__dropzone--disabled' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="File upload dropzone"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && fileInputRef.current?.click();
          }
        }}
      >
        <div className="file-upload__dropzone-icon">
          <Icon name="fileText" size={32} color="var(--color-primary)" />
        </div>
        <div className="file-upload__dropzone-text-group">
          <p className="file-upload__dropzone-title">
            Drag & drop files here or <span className="file-upload__browse-link">click to browse</span>
          </p>
          <p className="file-upload__dropzone-subtitle">
            Supports PDF, JPG, PNG, DOCX up to 10MB per file
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="file-upload__input"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>

      {/* Uploaded Files Table List */}
      {files.length > 0 && (
        <div className="file-upload__list">
          <h4 className="file-upload__list-title">Attached Documents ({files.length})</h4>
          <div className="file-upload__rows">
            {files.map((item) => (
              <div key={item.id} className="file-upload__row">
                <div className="file-upload__file-info">
                  <Icon name="fileText" size={20} color="var(--color-primary)" />
                  <div className="file-upload__meta">
                    <span className="file-upload__name" title={item.name}>
                      {item.name}
                    </span>
                    <span className="file-upload__size">{formatFileSize(item)}</span>
                  </div>
                </div>

                <div className="file-upload__controls">
                  <select
                    className="file-upload__type-select"
                    value={item.docType}
                    onChange={(e) => onDocTypeChange(item.id, e.target.value)}
                    disabled={disabled}
                  >
                    <option value="ID Proof">ID Proof</option>
                    <option value="Address Proof">Address Proof</option>
                    <option value="Resume">Resume</option>
                    <option value="Offer Letter">Offer Letter</option>
                    <option value="Other">Other</option>
                  </select>

                  <div className="file-upload__status-badge">
                    {item.status === 'completed' ? (
                      <span className="file-upload__check-icon" title="Upload complete">
                        <Icon name="check" size={16} color="#059669" />
                      </span>
                    ) : (
                      <div className="file-upload__progress-bar">
                        <div
                          className="file-upload__progress-fill"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="file-upload__remove-file-btn"
                    onClick={() => onRemoveFile(item.id)}
                    disabled={disabled}
                    title="Remove File"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
