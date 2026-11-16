'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UseCopyToClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const {
    successMessage = 'Copied to clipboard',
    errorMessage = 'Failed to copy',
    onSuccess,
    onError,
  } = options;

  const copy = useCallback(async (text: string) => {
    if (isCopying) return;

    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage);
      onSuccess?.();

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(errorMessage);
      onError?.(error as Error);
    } finally {
      setIsCopying(false);
    }
  }, [isCopying, successMessage, errorMessage, onSuccess, onError]);

  const reset = useCallback(() => {
    setCopied(false);
    setIsCopying(false);
  }, []);

  return {
    copy,
    reset,
    copied,
    isCopying,
  };
}