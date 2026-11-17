import { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
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

async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    if (session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <>
      <div className="flex flex-1">
        <AdminSidebar navigation={adminNavigation} username={session.username} />
        <main className="flex-1 lg:ml-64 min-h-screen bg-stone-50">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}