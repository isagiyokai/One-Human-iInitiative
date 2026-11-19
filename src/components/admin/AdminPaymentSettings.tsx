'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const paymentMethods = [
  {
    id: 'bitcoin',
    name: 'Bitcoin (BTC)',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-12h-2v2h2v-2zm0 4h-2v4h2v-4z"/>
      </svg>
    ),
    fields: [
      { name: 'bitcoinAddress', label: 'Bitcoin Address', type: 'text', placeholder: 'bc1...', required: true },
    ],
  },
  {
    id: 'solana',
    name: 'Solana (SOL)',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.055 3.309l8.553 3.86-1.826 7.304c-.23.92-.822 1.485-1.58 1.425l-6.115-.491 3.573-5.209c.32-.467.148-.96-.246-1.13l-4.807-2.167 1.646-6.584zm1.89 1.588 4.597 2.075-2.739 8.218c-.083.25-.345.25-.428 0L8.433 11.26l3.681-5.363zM14.753 8.49l-3.359 4.897-3.816-.307 3.246-4.69 3.929.1z"/>
      </svg>
    ),
    fields: [
      { name: 'solanaAddress', label: 'Solana Address', type: 'text', placeholder: '7xKX...', required: true },
    ],
  },

];