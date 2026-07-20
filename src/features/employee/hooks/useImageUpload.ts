import { useState, useCallback } from 'react';
import { employeeApi } from '../services/employeeApi';

export const useImageUpload = (initialUrl?: string | null) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const selectImage = useCallback((file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }, []);

  const removeImage = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const uploadSelectedImage = useCallback(async (): Promise<string | null> => {
    if (!selectedFile) return previewUrl;
    setIsUploading(true);
    try {
      const result = await employeeApi.uploadFile(selectedFile);
      setPreviewUrl(result.url);
      return result.url;
    } catch (err) {
      console.error('Image upload failed:', err);
      return previewUrl;
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, previewUrl]);

  return {
    previewUrl,
    selectedFile,
    isUploading,
    selectImage,
    removeImage,
    uploadSelectedImage,
  };
};
