import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommunityContent } from '@/components/community/CommunityContent';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Participate in community petitions and voting for campaign target increases.',
};

export default function CommunityPage() {
  return (
    <>
      <Header />
      <main className="flex-1" id="main-content">
        <CommunityContent />
      </main>
      <Footer />
    </>
  );
}