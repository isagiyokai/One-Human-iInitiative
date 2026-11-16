'use client';

import { Toaster } from '@/components/ui/Toaster';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}