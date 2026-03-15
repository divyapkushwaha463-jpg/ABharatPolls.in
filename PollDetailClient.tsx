'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ShareButtons from './ShareButtons';
import CountdownTimer from './CountdownTimer';
import PollCard from './PollCard';
import { Poll } from '@/types';

const BarChart = dynamic(() => import('./BarChart'), { ssr: false });
const PieChart = dynamic(() => import('./PieChart'), { ssr: false });

interface Props { id: string; }

export default function PollDetailClient({ id }: Props) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'bar' | 'pie'>('bar');
  const [relatedPolls, setRelatedPolls] = useState<Poll[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/polls?id=${id}`);
        const data = await res.json();
        setPoll(data);

        // Load related polls
        const relRes = await fetch(`/api/polls?category=${data.category}`);
        const relData = await relRes.json();
        setRelatedPolls(Array.isArray(relData) ? relData.filter((p: Poll) => p.id !== parseInt(id)).slice(0, 3) : []);
      } catch {/* */} finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="skeleton h-12 w-3/4 mb-4 rounded-xl" />
        <div className="skeleton h-6 w-1/2 mb-8 rounded-xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-4">🗳️</span>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          Poll Not Found
        </h1>
        <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif' }}>
          This poll may have been removed or doesn&apos;t exist.
        </p>
      </div>
    );
  }

  const totalVotes = poll.options?.reduce((a, o) => a + (o.vote_count || 0), 0) || 0;
  const winner = poll.options?.reduce((a, b) => (a.vote_count || 0) > (b.vote_count || 0) ? a : b);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6" style={{ fontFamily: 'Hind, sans-serif' }}>
        <a href="/" className="hover:text-saffron-400">Home</a>
        <span>/</span>
        <a href="/elections" className="hover:text-saffron-400">Polls</a>
        <span>/</span>
        <span className="text-gray-400">#{id}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider"
            style={{ background: 'rgba(255,107,26,0.15)', color: '#FF8C42', fontFamily: 'Rajdhani, sans-serif', border: '1px solid rgba(255,107,26,0.3)' }}>
            📊 Poll #{id}
          </span>
          {poll.status === 'active' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', lineHeight: 1.2 }}>
          {poll.title}
        </h1>
        {poll.description && (
          <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif' }}>
            {poll.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <span className="text-sm text-gray-400" style={{ fontFamily: 'Hind, sans-serif' }}>
            🗳 <strong className="text-white">{totalVotes.toLocaleString('en-IN')}</strong> total votes
          </span>
          {poll.expires_at && (
            <CountdownTimer expiresAt={poll.expires_at} compact />
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Vote / Results card */}
        <div className="lg:col-span-3">
          <div className="bg-dark-800 rounded-2xl border p-6"
            style={{ borderColor: 'rgba(255,107,26,0.1)' }}>
            <PollCard poll={poll} />
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Winner */}
          {winner && totalVotes > 0 && (
            <div className="rounded-2xl p-5 border"
              style={{ background: 'linear-gradient(135deg, rgba(255,107,26,0.1), rgba(14,21,40,0.8))', borderColor: 'rgba(255,107,26,0.2)' }}>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                🏆 Current Leader
              </p>
              <p className="text-xl font-black text-white mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {winner.label}
              </p>
              <p className="text-3xl font-black text-saffron-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                {winner.percentage || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Hind, sans-serif' }}>
                {(winner.vote_count || 0).toLocaleString('en-IN')} votes
              </p>
            </div>
          )}

          {/* Vote breakdown */}
          <div className="rounded-2xl p-5 border bg-dark-800"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Vote Breakdown
            </p>
            {poll.options?.map(opt => (
              <div key={opt.id} className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: opt.color || '#FF6B1A' }} />
                <span className="text-sm text-gray-300 flex-1 truncate" style={{ fontFamily: 'Hind, sans-serif' }}>
                  {opt.label}
                </span>
                <span className="text-sm font-bold" style={{ color: opt.color || '#FF6B1A', fontFamily: 'Rajdhani, sans-serif' }}>
                  {opt.percentage || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      {poll.options && poll.options.length > 0 && totalVotes > 0 && (
        <div className="bg-dark-800 rounded-2xl border p-6 mb-8"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {/* Chart toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              📈 Results Chart
            </h2>
            <div className="flex gap-1 bg-dark-700 p-1 rounded-lg">
              {(['bar', 'pie'] as const).map(type => (
                <button key={type} onClick={() => setActiveChart(type)}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                    activeChart === type ? 'bg-saffron-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {type === 'bar' ? '📊 Bar' : '🥧 Pie'}
                </button>
              ))}
            </div>
          </div>
          {activeChart === 'bar' ? (
            <BarChart options={poll.options} />
          ) : (
            <PieChart options={poll.options} />
          )}
        </div>
      )}

      {/* Share */}
      <div className="bg-dark-800 rounded-2xl border p-6 mb-10"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <h3 className="text-base font-bold text-white mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          📤 Share This Poll
        </h3>
        <ShareButtons pollTitle={poll.title} pollId={poll.id} />
      </div>

      {/* Related polls */}
      {relatedPolls.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-white mb-5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            🔗 Related Polls
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPolls.map(p => <PollCard key={p.id} poll={p} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
