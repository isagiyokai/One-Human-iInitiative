'use client';

import React from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/Button';

interface CopyToClipboardProps {
  text: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CopyToClipboard({
  text,
  disabled = false,
  ariaLabel = 'Copy to clipboard',
  className = '',
  children,
}: CopyToClipboardProps) {
  const { copy, copied } = useCopyToClipboard({
    onSuccess: () => {},
    onError: () => {},
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copy(text);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled || copied}
      aria-label={ariaLabel}
      aria-pressed={copied}
      className={className}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : children ? (
        children
      ) : (
        <>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy
        </>
      )}
    </Button>
  );
}