import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'One Human Initiative Admin Dashboard',
};

const adminNavigation = [
  { name: 'Overview', href: '/admin', icon: 'home' },
  { name: 'Campaign', href: '/admin/campaign', icon: 'settings' },
  { name: 'Payments', href: '/admin/payments', icon: 'credit-card' },
  { name: 'Contributions', href: '/admin/contributions', icon: 'list' },
  { name: 'Repayment Contacts', href: '/admin/repayment-contacts', icon: 'link' },
  { name: 'Expenses', href: '/admin/expenses', icon: 'receipt' },
  { name: 'Community', href: '/admin/community', icon: 'users' },
  { name: 'Updates', href: '/admin/updates', icon: 'file-text' },
  { name: 'Audit Log', href: '/admin/audit', icon: 'shield' },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options: { [key: string]: unknown } }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <AdminSidebar navigation={adminNavigation} user={user} />
        <main className="flex-1 lg:ml-64 min-h-screen bg-warm-white">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}