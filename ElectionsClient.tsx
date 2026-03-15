'use client';

import { useState, useEffect } from 'react';
import PollCard from './PollCard';
import { Poll } from '@/types';

const CATEGORIES = [
  { key: 'all', label: '🇮🇳 All', color: '#FF6B1A' },
  { key: 'election', label: '🗳️ Elections', color: '#138808' },
  { key: 'leader', label: '👑 Leaders', color: '#3B82F6' },
  { key: 'youth', label: '⚡ Youth', color: '#F59E0B' },
  { key: 'policy', label: '📜 Policy', color: '#8B5CF6' },
  { key: 'trending', label: '🔥 Trending', color: '#EF4444' },
];

export default function ElectionsClient() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filtered, setFiltered] = useState<Poll[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/polls')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setPolls(arr);
        setFiltered(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function filterBy(cat: string) {
    setActiveCategory(cat);
    setFiltered(cat === 'all' ? polls : polls.filter(p => p.category === cat));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero bar */}
      <div className="rounded-2xl p-6 mb-10 relative overflow-hidden border"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,26,0.1), rgba(19,136,8,0.05))',
          borderColor: 'rgba(255,107,26,0.2)',
        }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #FF6B1A 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 relative"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          🗳️ All Election Polls
        </h1>
        <p className="text-gray-400 relative" style={{ fontFamily: 'Hind, sans-serif' }}>
          Browse and vote in all active polls. Results update instantly.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => filterBy(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${
              activeCategory === cat.key
                ? 'text-white border-transparent'
                : 'text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
            style={{
              background: activeCategory === cat.key ? cat.color : 'transparent',
              fontFamily: 'Rajdhani, sans-serif',
            }}
          >
            {cat.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500 self-center" style={{ fontFamily: 'Hind, sans-serif' }}>
          {filtered.length} polls
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500" style={{ fontFamily: 'Hind, sans-serif' }}>
          No polls found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((poll, i) => (
            <div key={poll.id} className="animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
              <PollCard poll={poll} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
