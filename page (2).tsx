import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ElectionsClient from '@/components/ElectionsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Election Polls 2025–2029 — BharatPolls.in',
  description: 'Vote in UP, Delhi, Bihar and Lok Sabha election polls. See live predictions and real-time results.',
};

export default function ElectionsPage() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <ElectionsClient />
      <Footer />
    </main>
  );
}
