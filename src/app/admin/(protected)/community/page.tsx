import { Metadata } from 'next';
import { AdminCommunity } from '@/components/admin/AdminCommunity';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Manage petitions and view voting results',
};

export default function AdminCommunityPage() {
  return <AdminCommunity />;
}
