import { Metadata } from 'next';
import { AdminContributions } from '@/components/admin/AdminContributions';

export const metadata: Metadata = {
  title: 'Contributions',
  description: 'Manage and verify contributions',
};

export default function AdminContributionsPage() {
  return <AdminContributions />;
}
