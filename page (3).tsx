import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import TrendingPolls from '@/components/TrendingPolls';
import UpcomingElections from '@/components/UpcomingElections';
import YouthLeaderPolls from '@/components/YouthLeaderPolls';
import LatestResults from '@/components/LatestResults';
import NewsTicker from '@/components/NewsTicker';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-950">
      <Navbar />
      <NewsTicker />
      <HeroSection />
      <TrendingPolls />
      <UpcomingElections />
      <YouthLeaderPolls />
      <LatestResults />
      <Footer />
    </main>
  );
}
