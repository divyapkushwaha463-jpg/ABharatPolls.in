import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PollDetailClient from '@/components/PollDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Poll #${params.id} — BharatPolls.in`,
    description: 'Vote and see live results on BharatPolls.in',
  };
}

export default function PollPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <PollDetailClient id={params.id} />
      <Footer />
    </main>
  );
}
