import { Metadata } from 'next';
import { AdminExpenses } from '@/components/admin/AdminExpenses';

export const metadata: Metadata = {
  title: 'Expenses',
  description: 'Manage campaign expenses and evidence',
};

export default function AdminExpensesPage() {
  return <AdminExpenses />;
}
