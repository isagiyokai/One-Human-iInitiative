import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PrivacyContent } from '@/components/legal/PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'How we collect, use, and protect your data in the One Human Initiative campaign.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1" id="main-content">
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}