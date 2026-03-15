'use client';

import { useState, useEffect } from 'react';
import PollCard from './PollCard';
import { Poll } from '@/types';

export default function TrendingPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/polls?trending=6')
      .then(r => r.json())
      .then(data => { setPolls(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #FF6B1A, #FF8C42)' }} />
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              🔥 Trending Polls
            </h2>
          </div>
          <p className="text-gray-400 text-sm pl-4" style={{ fontFamily: 'Hind, sans-serif' }}>
            Most voted polls in the last 24 hours
          </p>
        </div>
        <a
          href="/elections"
          className="hidden sm:flex items-center gap-1 text-saffron-400 hover:text-saffron-300 text-sm font-bold transition-colors"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          View all polls →
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-16 text-gray-500" style={{ fontFamily: 'Hind, sans-serif' }}>
          No active polls found. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {polls.map((poll, i) => (
            <div
              key={poll.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <PollCard poll={poll} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
