import { Metadata } from 'next';
import { AdminPaymentSettings } from '@/components/admin/AdminPaymentSettings';

export const metadata: Metadata = {
  title: 'Payment Settings',
  description: 'Configure payment addresses and methods',
};

export default function AdminPaymentsPage() {
  return <AdminPaymentSettings />;
}
