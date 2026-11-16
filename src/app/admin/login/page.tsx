'use client';

import React from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-charcoal-900">Admin Sign In</h1>
            <p className="mt-2 text-stone-600">Enter your credentials to access the dashboard</p>
          </div>

          <Card variant="default" padding="lg">
            <CardHeader className="text-center">
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Use your Supabase Auth credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
                    {error}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 p-4 rounded-lg bg-stone-50 border border-stone-200">
                <p className="text-xs text-stone-600 text-center">
                  <strong>Note:</strong> MFA is enforced via Supabase Dashboard.
                  Configure MFA settings in your Supabase project authentication settings.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-stone-500">
            <a href="/" className="text-earth-600 hover:underline">← Back to Campaign</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}