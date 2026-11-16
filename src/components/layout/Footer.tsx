'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="One Human Initiative Home">
              <span className="text-xl font-bold text-charcoal-900 tracking-tight">
                ONE HUMAN INITIATIVE
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-stone-600 text-sm leading-relaxed">
              A privacy-conscious campaign to provide direct financial support to an anonymous individual.
              No tracking. No accounts. No compromise.
            </p>
          </div>

          {/* Legal Links */}
          <nav aria-label="Legal">
            <h3 className="text-sm font-semibold text-charcoal-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-stone-600 hover:text-charcoal-900 transition-colors"
                >
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-stone-600 hover:text-charcoal-900 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </nav>

          {/* Campaign Info */}
          <nav aria-label="Campaign">
            <h3 className="text-sm font-semibold text-charcoal-900 uppercase tracking-wider mb-4">
              Campaign
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/transparency"
                  className="text-sm text-stone-600 hover:text-charcoal-900 transition-colors"
                >
                  Transparency
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm text-stone-600 hover:text-charcoal-900 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/updates"
                  className="text-sm text-stone-600 hover:text-charcoal-900 transition-colors"
                >
                  Updates
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-stone-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-stone-500">
              &copy; {currentYear} One Human Initiative. All rights reserved.
            </p>
            <p className="text-xs text-stone-400">
              Not a registered charity. Not an investment product.
              Voluntary contributions only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}