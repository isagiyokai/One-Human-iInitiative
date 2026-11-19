import { Metadata } from 'next';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';

export const metadata: Metadata = {
  title: 'Audit Log',
  description: 'View administrative action audit trail',
};

export default function AdminAuditLogPage() {
  return <AdminAuditLog />;
}
