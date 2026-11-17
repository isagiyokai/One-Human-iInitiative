'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNavigation = [
  { name: 'Overview', href: '/admin' },
  { name: 'Campaign', href: '/admin/campaign' },
  { name: 'Payments', href: '/admin/payments' },
  { name: 'Contributions', href: '/admin/contributions' },
  { name: 'Expenses', href: '/admin/expenses' },
  { name: 'Community', href: '/admin/community' },
  { name: 'Updates', href: '/admin/updates' },
  { name: 'Audit Log', href: '/admin/audit' },
];

export function AdminHeader() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      window.location.href = '/admin/login';
    } catch {
      window.location.href = '/admin/login';
    }
  };

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2" aria-label="Admin Dashboard Home">
              <span className="text-xl font-bold text-charcoal-900 tracking-tight">
                ONE HUMAN INITIATIVE
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-charcoal-100 text-charcoal-700">
                Admin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Admin navigation">
            {adminNavigation.map((item) => (
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
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-stone-600 hover:text-charcoal-900 transition-colors"
            >
              Sign Out
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <MobileMenuButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation pathname={pathname} onLogout={handleLogout} />
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
      aria-controls="admin-mobile-menu"
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

function MobileNavigation({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      id="admin-mobile-menu"
      className={cn(
        'lg:hidden border-t border-stone-200 bg-white',
        isOpen ? 'block' : 'hidden'
      )}
    >
      <nav className="px-4 py-4 space-y-3" aria-label="Admin mobile navigation">
        {adminNavigation.map((item) => (
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
        <button
          onClick={() => {
            onLogout();
            setIsOpen(false);
          }}
          className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-stone-600 hover:bg-stone-100 hover:text-charcoal-900 transition-colors"
        >
          Sign Out
        </button>
      </nav>
    </div>
  );
}