import { Metadata } from 'next';
import { AdminUpdates } from '@/components/admin/AdminUpdates';

export const metadata: Metadata = {
  title: 'Updates',
  description: 'Manage campaign updates and announcements',
};

export default function AdminUpdatesPage() {
  return <AdminUpdates />;
}
