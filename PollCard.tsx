'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import { Poll, PollOption } from '@/types';

const PARTY_COLORS: Record<string, string> = {
  'BJP': '#FF6B1A',
  'Congress': '#138808',
  'SP': '#E41E30',
  'AAP': '#1E40AF',
  'BSP': '#0047AB',
  'TMC': '#26A69A',
  'JDU': '#10B981',
  'NDA Alliance': '#FF6B1A',
  'INDIA Alliance': '#E41E30',
};

interface PollCardProps {
  poll: Poll;
  compact?: boolean;
}

export default function PollCard({ poll, compact = false }: PollCardProps) {
  const [options, setOptions] = useState<PollOption[]>(poll.options || []);
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState('');
  const [totalVotes, setTotalVotes] = useState(poll.total_votes || 0);

  useEffect(() => {
    // Generate fingerprint from localStorage + browser data
    let fp = localStorage.getItem(`fp_${poll.id}`);
    if (!fp) {
      const raw = `${navigator.userAgent}-${screen.width}-${screen.height}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
      fp = btoa(raw).substring(0, 32);
    }
    setFingerprint(fp);

    // Check if already voted
    const alreadyVoted = localStorage.getItem(`voted_${poll.id}`);
    if (alreadyVoted) {
      setVoted(true);
      setSelectedOption(parseInt(alreadyVoted));
      fetchResults();
    }
  }, [poll.id]);

  async function fetchResults() {
    try {
      const res = await fetch(`/api/results?pollId=${poll.id}`);
      const data = await res.json();
      if (data.options) {
        setOptions(data.options);
        setTotalVotes(data.totalVotes);
      }
    } catch {/* silent */}
  }

  async function handleVote(optionId: number) {
    if (voted || loading || poll.status !== 'active') return;
    setLoading(true);
    setSelectedOption(optionId);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: poll.id, optionId, fingerprint }),
      });
      const data = await res.json();

      if (data.success || data.alreadyVoted) {
        setVoted(true);
        localStorage.setItem(`voted_${poll.id}`, String(optionId));
        localStorage.setItem(`fp_${poll.id}`, fingerprint);
        if (data.results) {
          setOptions(data.results);
          const total = data.results.reduce((a: number, o: PollOption) => a + (o.vote_count || 0), 0);
          setTotalVotes(total);
        }
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const categoryLabels: Record<string, string> = {
    election: '🗳️ Election',
    leader: '👤 Leader',
    policy: '📜 Policy',
    youth: '⚡ Youth',
    trending: '🔥 Trending',
  };

  const getOptionColor = (opt: PollOption) => {
    return PARTY_COLORS[opt.party || ''] || opt.color || '#FF6B1A';
  };

  return (
    <div className="poll-card bg-dark-800 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-card-gradient pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'rgba(255,107,26,0.1)',
                borderColor: 'rgba(255,107,26,0.3)',
                color: '#FF8C42',
              }}>
              {categoryLabels[poll.category] || '📊 Poll'}
            </span>
            {poll.status === 'active' && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold" style={{fontFamily: 'Rajdhani, sans-serif'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            )}
            {poll.status === 'closed' && (
              <span className="text-xs text-gray-500 font-bold" style={{fontFamily: 'Rajdhani, sans-serif'}}>
                🔒 CLOSED
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-base leading-snug" style={{fontFamily: 'Rajdhani, sans-serif', fontSize: '17px'}}>
            {poll.title}
          </h3>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 relative">
        {options.slice(0, compact ? 3 : options.length).map((option) => {
          const pct = option.percentage || 0;
          const color = getOptionColor(option);
          const isSelected = selectedOption === option.id;
          const isWinner = voted && pct === Math.max(...options.map(o => o.percentage || 0));

          return (
            <div key={option.id}>
              {!voted && poll.status === 'active' ? (
                // Vote button
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={loading}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left group active:scale-[0.98] ${
                    selectedOption === option.id && loading
                      ? 'border-saffron-500/50 bg-saffron-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{borderColor: selectedOption === option.id && loading ? color : 'rgba(255,255,255,0.2)'}}>
                    {selectedOption === option.id && loading && (
                      <div className="w-2 h-2 rounded-full" style={{background: color}} />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white flex-1" style={{fontFamily: 'Hind, sans-serif'}}>
                    {option.label}
                  </span>
                  {option.party && (
                    <span className="text-xs text-gray-500" style={{fontFamily: 'Hind, sans-serif'}}>{option.party}</span>
                  )}
                </button>
              ) : (
                // Results bar
                <div className={`rounded-xl overflow-hidden border transition-all ${
                  isSelected ? 'border-opacity-60' : 'border-white/5'
                }`}
                  style={{borderColor: isSelected ? color : undefined}}>
                  <div className="flex items-center justify-between px-3 py-2.5 relative">
                    {/* Background bar */}
                    <div
                      className="vote-bar absolute left-0 top-0 bottom-0 opacity-15 rounded-xl transition-all duration-700"
                      style={{width: `${pct}%`, background: color}}
                    />
                    <div className="relative flex items-center gap-2 flex-1">
                      {isWinner && <span className="text-sm">🏆</span>}
                      {isSelected && !isWinner && <span className="text-sm">✓</span>}
                      <span className="text-sm font-semibold text-gray-100" style={{fontFamily: 'Hind, sans-serif'}}>
                        {option.label}
                      </span>
                      {option.party && (
                        <span className="text-xs text-gray-500 hidden sm:inline">{option.party}</span>
                      )}
                    </div>
                    <div className="relative flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{width: `${pct}%`, background: color}} />
                      </div>
                      <span className="text-sm font-bold w-12 text-right"
                        style={{color, fontFamily: 'Rajdhani, sans-serif'}}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5 relative">
        <span className="text-xs text-gray-500" style={{fontFamily: 'Hind, sans-serif'}}>
          🗳 {totalVotes.toLocaleString('en-IN')} votes
        </span>

        <div className="flex items-center gap-3">
          {poll.expires_at && !voted && (
            <CountdownTimer expiresAt={poll.expires_at} compact />
          )}
          {voted && (
            <span className="text-xs text-emerald-400 font-bold" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              ✓ Voted
            </span>
          )}
          {!compact && (
            <Link
              href={`/polls/${poll.id}`}
              className="text-xs text-saffron-400 hover:text-saffron-300 font-bold transition-colors"
              style={{fontFamily: 'Rajdhani, sans-serif'}}
            >
              Full Results →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
