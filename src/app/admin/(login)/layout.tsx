import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Sign In',
  description: 'Sign in to the One Human Initiative Admin Dashboard',
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}