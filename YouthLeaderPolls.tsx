'use client';

import { useState, useEffect } from 'react';
import PollCard from './PollCard';
import { Poll } from '@/types';

export default function YouthLeaderPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/polls?category=youth')
      .then(r => r.json())
      .then(data => { setPolls(Array.isArray(data) ? data.slice(0, 3) : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #FFB347, #FF6B1A)' }} />
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              ⚡ Youth Favorite Leaders
            </h2>
          </div>
          <p className="text-gray-400 text-sm pl-4" style={{ fontFamily: 'Hind, sans-serif' }}>
            Who does India&apos;s 18–35 generation trust the most?
          </p>
        </div>
      </div>

      {/* Age group filter hint */}
      <div className="flex flex-wrap gap-2 mb-6 pl-4">
        {['18–25', '26–35', '36–50', '50+'].map(g => (
          <span key={g} className="text-xs px-3 py-1 rounded-full border text-gray-400"
            style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', fontFamily: 'Rajdhani, sans-serif' }}>
            {g}
          </span>
        ))}
        <span className="text-xs text-gray-500 self-center" style={{ fontFamily: 'Hind, sans-serif' }}>
          — age-wise insights on poll page
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-12 text-gray-500" style={{ fontFamily: 'Hind, sans-serif' }}>
          Youth polls coming soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {polls.map((poll, i) => (
            <div key={poll.id} className="animate-slide-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
              <PollCard poll={poll} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
