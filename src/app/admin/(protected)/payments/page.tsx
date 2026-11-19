import { Metadata } from 'next';
import { AdminPaymentSettings } from '@/components/admin/AdminPaymentSettings';

export const metadata: Metadata = {
  title: 'Payment Settings',
  description: 'Configure payment addresses and methods',
};

export default async function AdminPaymentsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options: { [key: string]: unknown } }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <AdminPaymentSettings />;
}