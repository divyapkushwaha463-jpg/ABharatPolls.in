import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminClient from '@/components/AdminClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — BharatPolls.in',
  description: 'Manage polls, view analytics and control BharatPolls platform.',
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <AdminClient />
      <Footer />
    </main>
  );
}
