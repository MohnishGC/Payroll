import React from 'react';
import { FileUpload, type UploadedFileItem } from '../../../../../components/ui/FileUpload/FileUpload';
import './FormTabCommon.css';

export interface DocumentsFormTabProps {
  files: UploadedFileItem[];
  errors: Record<string, string>;
  onChangeFiles: (newList: UploadedFileItem[]) => void;
  uploadDocumentFiles: (files: File[]) => Promise<void>;
  disabled?: boolean;
}

export const DocumentsFormTab: React.FC<DocumentsFormTabProps> = ({
  files,
  errors,
  onChangeFiles,
  uploadDocumentFiles,
  disabled = false,
}) => {
  const handleAddFiles = (newRawFiles: File[]) => {
    uploadDocumentFiles(newRawFiles);
  };

  const handleRemoveFile = (id: string) => {
    onChangeFiles(files.filter((f) => f.id !== id));
  };

  const handleDocTypeChange = (id: string, docType: string) => {
    const updated = files.map((f) => (f.id === id ? { ...f, docType } : f));
    onChangeFiles(updated);
  };

  return (
    <div className="form-tab-container">
      {errors['uploadPending'] && (
        <p className="form-field__error-msg" role="alert">
          {errors['uploadPending']}
        </p>
      )}

      <FileUpload
        files={files}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
        onDocTypeChange={handleDocTypeChange}
        disabled={disabled}
      />
    </div>
  );
};
export default DocumentsFormTab;
