import { Metadata } from 'next';
import { AdminCampaignSettings } from '@/components/admin/AdminCampaignSettings';

export const metadata: Metadata = {
  title: 'Campaign Settings',
  description: 'Configure campaign settings',
};

export default function AdminCampaignPage() {
  return <AdminCampaignSettings />;
}
