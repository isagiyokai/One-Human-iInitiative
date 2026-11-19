import { Metadata } from 'next';
import { AdminOverview } from '@/components/admin/AdminOverview';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin Dashboard Overview',
};

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
