import type { UploadedFileItem } from '../../../components/ui/FileUpload/FileUpload';

export const validateDocuments = (
  files: UploadedFileItem[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const isUploading = files.some((f) => f.status === 'uploading');
  if (isUploading) {
    errors['uploadPending'] = 'Please wait for file uploads to settle before submitting.';
  }

  return errors;
};
