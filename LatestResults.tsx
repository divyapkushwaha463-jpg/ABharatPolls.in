'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Poll } from '@/types';

const BarChart = dynamic(() => import('./BarChart'), { ssr: false });

export default function LatestResults() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/api/polls?status=active')
      .then(r => r.json())
      .then(async (data: Poll[]) => {
        const withOptions = await Promise.all(
          (Array.isArray(data) ? data.slice(0, 4) : []).map(async (poll) => {
            const res = await fetch(`/api/results?pollId=${poll.id}`);
            const result = await res.json();
            return { ...poll, options: result.options || [], total_votes: result.totalVotes || 0 };
          })
        );
        setPolls(withOptions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activePoll = polls[activeIndex];

  return (
    <section className="py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #05070F 0%, #080C18 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,26,0.3), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #3B82F6, #1E40AF)' }} />
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              📊 Latest Results
            </h2>
            <p className="text-gray-400 text-sm" style={{ fontFamily: 'Hind, sans-serif' }}>
              Live poll results updated in real-time
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-80 rounded-2xl" />
            <div className="skeleton h-80 rounded-2xl" />
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No results yet</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Poll selector */}
            <div className="lg:col-span-1 flex flex-col gap-3">
              {polls.map((poll, i) => (
                <button
                  key={poll.id}
                  onClick={() => setActiveIndex(i)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                    i === activeIndex
                      ? 'border-saffron-500/50 bg-saffron-500/10'
                      : 'border-white/5 bg-white/2 hover:bg-white/5'
                  }`}
                >
                  <p className="text-sm font-bold text-white line-clamp-2 mb-1"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {poll.title}
                  </p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Hind, sans-serif' }}>
                    🗳 {(poll.total_votes || 0).toLocaleString('en-IN')} votes
                  </p>
                </button>
              ))}
            </div>

            {/* Chart area */}
            <div className="lg:col-span-2 rounded-2xl border p-6"
              style={{ background: 'rgba(14,21,40,0.8)', borderColor: 'rgba(255,107,26,0.1)' }}>
              {activePoll && activePoll.options && activePoll.options.length > 0 ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {activePoll.title}
                      </h3>
                      <p className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif' }}>
                        Total: {(activePoll.total_votes || 0).toLocaleString('en-IN')} votes
                      </p>
                    </div>
                    <Link href={`/polls/${activePoll.id}`}
                      className="text-xs text-saffron-400 font-bold hover:text-saffron-300"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Full Results →
                    </Link>
                  </div>

                  {/* Vote bars */}
                  <div className="flex flex-col gap-3 mb-6">
                    {activePoll.options.map((opt) => (
                      <div key={opt.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-200" style={{ fontFamily: 'Hind, sans-serif' }}>
                            {opt.label}
                          </span>
                          <span className="text-sm font-bold" style={{ color: opt.color || '#FF6B1A', fontFamily: 'Rajdhani, sans-serif' }}>
                            {opt.percentage || 0}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${opt.percentage || 0}%`, background: opt.color || '#FF6B1A' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <BarChart options={activePoll.options} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a poll to see results
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
