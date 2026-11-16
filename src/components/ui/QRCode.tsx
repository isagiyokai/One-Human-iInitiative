'use client';

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  ariaLabel?: string;
  className?: string;
  includeMargin?: boolean;
  level?: 'L' | 'M' | 'Q' | 'H';
  backgroundColor?: string;
  foregroundColor?: string;
}

export function QRCodeComponent({
  value,
  size = 120,
  ariaLabel,
  className = '',
  includeMargin = true,
  level = 'M',
  backgroundColor = '#FAFAF9',
  foregroundColor = '#1C1917',
}: QRCodeProps) {
  return (
    <div
      className={className}
      role="img"
      aria-label={ariaLabel || `QR code for ${value}`}
    >
      <QRCodeCanvas
        value={value}
        size={size}
        includeMargin={includeMargin}
        level={level}
        bgColor={backgroundColor}
        fgColor={foregroundColor}
      />
    </div>
  );
}

export default QRCodeComponent;