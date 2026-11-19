import { Metadata } from 'next';
import { AdminRepaymentContacts } from '@/components/admin/AdminRepaymentContacts';

export const metadata: Metadata = {
  title: 'Repayment Contacts',
  description: 'View and manage private repayment contacts',
};

export default function AdminRepaymentContactsPage() {
  return <AdminRepaymentContacts />;
}
