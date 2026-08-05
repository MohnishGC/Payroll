import { useState, useEffect } from 'react';
import { employeeApi } from '../services/employeeApi';

// Module-level caches
const secureImageCache: Record<string, string> = {};
const inFlightRequests: Record<string, Promise<string>> = {};

export const useSecureImage = (path?: string | null) => {
  const [src, setSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const isBlank = !path || 
      path.trim() === '' || 
      path.trim() === '/' ||
      path === 'null' || 
      path === 'undefined';

    if (isBlank) {
      setSrc(null);
      return;
    }

    if (path.startsWith('http') || path.startsWith('blob:')) {
      setSrc(path);
      return;
    }

    // 1. Resolve from completed cache
    if (secureImageCache[path]) {
      setSrc(secureImageCache[path]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(false);

    // 2. Resolve from in-flight requests or create new one
    if (!inFlightRequests[path]) {
      inFlightRequests[path] = employeeApi.downloadFile(path)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          secureImageCache[path] = url;
          return url;
        })
        .finally(() => {
          // Remove from in-flight requests once resolved/rejected
          delete inFlightRequests[path];
        });
    }

    inFlightRequests[path]
      .then((url) => {
        if (isMounted) {
          setSrc(url);
        }
      })
      .catch((err) => {
        console.error('Failed to load secure image:', err);
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [path]);

  return { src, isLoading, error };
};
export default useSecureImage;
