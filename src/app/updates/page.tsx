import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UpdatesContent } from '@/components/updates/UpdatesContent';

export const metadata: Metadata = {
  title: 'Updates',
  description: 'Latest campaign updates and announcements.',
};

export default function UpdatesPage() {
  return (
    <>
      <Header />
      <main className="flex-1" id="main-content">
        <UpdatesContent />
      </main>
      <Footer />
    </>
  );
}