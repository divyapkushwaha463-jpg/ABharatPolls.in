'use client';

import { useState, useEffect } from 'react';

interface Leader {
  id: number;
  name: string;
  party: string;
  state: string;
  position: string;
  approval_percent: number;
  disapproval_percent: number;
  neutral_percent: number;
  total_votes: number;
  weekly_rank: number;
}

const PARTY_COLORS: Record<string, string> = {
  'BJP': '#FF6B1A',
  'Congress': '#138808',
  'AAP': '#1E40AF',
  'SP': '#E41E30',
  'TMC': '#26A69A',
  'JDU': '#10B981',
  'BSP': '#0047AB',
};

const PARTY_SHORT: Record<string, string> = {
  'Bharatiya Janata Party': 'BJP',
  'Indian National Congress': 'INC',
  'Aam Aadmi Party': 'AAP',
  'Samajwadi Party': 'SP',
  'Trinamool Congress': 'TMC',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function LeadersClient() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaders')
      .then(r => r.json())
      .then(data => { setLeaders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="rounded-2xl p-6 mb-10 relative overflow-hidden border"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,26,0.08), rgba(0,0,0,0))', borderColor: 'rgba(255,107,26,0.15)' }}>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          👑 Leader Popularity Rankings
        </h1>
        <p className="text-gray-400" style={{ fontFamily: 'Hind, sans-serif' }}>
          Real-time approval ratings based on public votes — updated daily
        </p>
      </div>

      {/* Top 3 podium */}
      {!loading && leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
          {[leaders[1], leaders[0], leaders[2]].map((leader, idx) => {
            const podiumRank = [2, 1, 3][idx];
            const height = [80, 110, 60][idx];
            const color = PARTY_COLORS[leader.party] || '#FF6B1A';
            return (
              <div key={leader.id} className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg font-black mb-2 border-2"
                  style={{ background: `${color}22`, borderColor: color, color, fontFamily: 'Rajdhani, sans-serif' }}>
                  {getInitials(leader.name)}
                </div>
                <p className="text-white text-xs font-bold text-center mb-1 line-clamp-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {leader.name.split(' ').slice(-1)[0]}
                </p>
                <p className="text-xs font-black mb-2" style={{ color, fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px' }}>
                  {leader.approval_percent}%
                </p>
                {/* Podium */}
                <div className="w-full rounded-t-lg flex items-center justify-center text-white font-black text-xl"
                  style={{ height: `${height}px`, background: `${color}33`, border: `1px solid ${color}44`, fontFamily: 'Bebas Neue, sans-serif' }}>
                  #{podiumRank}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full rankings table */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {leaders.map((leader, i) => {
            const color = PARTY_COLORS[leader.party] || '#FF6B1A';
            return (
              <div key={leader.id}
                className="rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                style={{
                  background: 'rgba(14,21,40,0.7)',
                  borderColor: i === 0 ? `${color}40` : 'rgba(255,255,255,0.05)',
                  animationDelay: `${i * 50}ms`,
                }}>
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-8 text-center font-black text-xl flex-shrink-0"
                    style={{ color: i < 3 ? color : '#4B5563', fontFamily: 'Bebas Neue, sans-serif' }}>
                    #{i + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base flex-shrink-0"
                    style={{ background: `${color}20`, color, border: `1.5px solid ${color}40`, fontFamily: 'Rajdhani, sans-serif' }}>
                    {getInitials(leader.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-white font-black text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {leader.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `${color}20`, color, fontFamily: 'Rajdhani, sans-serif' }}>
                        {PARTY_SHORT[leader.party] || leader.party}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Hind, sans-serif' }}>
                      {leader.position} · {leader.state}
                    </p>
                  </div>

                  {/* Approval stats */}
                  <div className="flex-shrink-0 text-right hidden sm:block">
                    <p className="text-2xl font-black" style={{ color, fontFamily: 'Bebas Neue, sans-serif' }}>
                      {leader.approval_percent}%
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Hind, sans-serif' }}>
                      {(leader.total_votes || 0).toLocaleString('en-IN')} votes
                    </p>
                  </div>
                </div>

                {/* Approval bar */}
                <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-700 rounded-l-full"
                    style={{ width: `${leader.approval_percent}%`, background: '#22C55E' }} />
                  <div className="h-full transition-all duration-700"
                    style={{ width: `${leader.neutral_percent}%`, background: '#6B7280' }} />
                  <div className="h-full transition-all duration-700 rounded-r-full flex-1"
                    style={{ width: `${leader.disapproval_percent}%`, background: '#EF4444' }} />
                </div>
                <div className="flex justify-between text-[10px] mt-1">
                  <span className="text-green-500 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    ✓ Approve {leader.approval_percent}%
                  </span>
                  <span className="text-gray-500">Neutral {leader.neutral_percent}%</span>
                  <span className="text-red-400 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    ✗ Disapprove {leader.disapproval_percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
