'use client';

import React from 'react';

interface CopyWalletAddressButtonProps {
  address: string;
  label: string;
}

export function CopyWalletAddressButton({ address, label }: CopyWalletAddressButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const [copyError, setCopyError] = React.useState('');

  async function fallbackCopy() {
    const textarea = document.createElement('textarea');
    textarea.value = address;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!successful) {
      throw new Error('Clipboard copy was not available');
    }
  }

  async function handleCopy() {
    setCopyError('');

    try {
      let copiedToClipboard = false;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(address);
          copiedToClipboard = true;
        } catch {
          // Android browsers and embedded webviews can reject Clipboard API access.
          // Fall through to the older document.execCommand implementation.
        }
      }

      if (!copiedToClipboard) {
        await fallbackCopy();
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError('Copy was blocked. Press and hold the address above, then choose Copy.');
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-charcoal-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-earth-500 focus:ring-offset-2"
        aria-label={copied ? `${label} copied` : label}
      >
        {copied ? 'Copied to clipboard' : label}
      </button>
      {copyError && (
        <p className="mt-2 text-xs leading-relaxed text-amber-800" role="status">
          {copyError}
        </p>
      )}
    </div>
  );
}
