import { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';

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
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-1 min-h-screen bg-stone-50">
      <AdminSidebar navigation={adminNavigation} username={session.username} />
      <main className="min-w-0 flex-1 min-h-screen bg-stone-50">
        <div className="p-6 md:p-8 xl:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}