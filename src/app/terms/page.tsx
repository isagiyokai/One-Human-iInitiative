import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TermsContent } from '@/components/legal/TermsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for participating in the One Human Initiative campaign.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1" id="main-content">
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}