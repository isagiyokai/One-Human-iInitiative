'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Transparency', href: '/transparency' },
  { name: 'Community', href: '/community' },
  { name: 'Updates', href: '/updates' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2" aria-label="One Human Initiative Home">
              <span className="text-xl font-bold text-charcoal-900 tracking-tight">
                ONE HUMAN INITIATIVE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-charcoal-900'
                    : 'text-stone-600 hover:text-charcoal-900'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenuButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation pathname={pathname} />
    </header>
  );
}

function MobileMenuButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center p-2 rounded-lg text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-charcoal-500"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      {isOpen ? (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}

function MobileNavigation({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      id="mobile-menu"
      className={cn(
        'md:hidden border-t border-stone-200 bg-white',
        isOpen ? 'block' : 'hidden'
      )}
    >
      <nav className="px-4 py-4 space-y-3" aria-label="Mobile navigation">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
              pathname === item.href
                ? 'bg-charcoal-100 text-charcoal-900'
                : 'text-stone-600 hover:bg-stone-100 hover:text-charcoal-900'
            )}
            aria-current={pathname === item.href ? 'page' : undefined}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}