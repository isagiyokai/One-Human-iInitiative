import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TransparencyContent } from '@/components/transparency/TransparencyContent';

export const metadata: Metadata = {
  title: 'Transparency',
  description: 'View all campaign expenses, financial summaries, and fund allocation details.',
};

export default function TransparencyPage() {
  return (
    <>
      <Header />
      <main className="flex-1" id="main-content">
        <TransparencyContent />
      </main>
      <Footer />
    </>
  );
}