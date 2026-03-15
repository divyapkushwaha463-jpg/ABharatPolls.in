import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeadersClient from '@/components/LeadersClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leader Popularity Rankings — BharatPolls.in',
  description: 'See approval ratings for top Indian political leaders. Who is India\'s most popular leader?',
};

export default function LeadersPage() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <LeadersClient />
      <Footer />
    </main>
  );
}
