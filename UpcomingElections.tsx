'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { differenceInDays, format } from 'date-fns';

interface Election {
  id: number;
  name: string;
  state: string;
  election_date: string;
  type: string;
  description?: string;
}

const TYPE_LABELS: Record<string, string> = {
  assembly: '🏛️ Assembly',
  lok_sabha: '🇮🇳 Lok Sabha',
  bypolls: '🗳️ By-Poll',
};

const STATE_COLORS: Record<string, string> = {
  'Uttar Pradesh': '#FF6B1A',
  'Delhi': '#1E40AF',
  'Bihar': '#10B981',
  'National': '#FFB347',
  'Rajasthan': '#E41E30',
  'West Bengal': '#26A69A',
};

export default function UpcomingElections() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/elections')
      .then(r => r.json())
      .then(data => { setElections(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #05070F 0%, #0E1528 50%, #05070F 100%)' }}>
      {/* Bg decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,26,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #138808, #22C55E)' }} />
              <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                🗓️ Upcoming Elections
              </h2>
            </div>
            <p className="text-gray-400 text-sm pl-4" style={{ fontFamily: 'Hind, sans-serif' }}>
              Track polls for all upcoming Indian elections
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {elections.map((el, i) => {
              const daysLeft = differenceInDays(new Date(el.election_date), new Date());
              const isPast = daysLeft < 0;
              const color = STATE_COLORS[el.state] || '#FF6B1A';

              return (
                <Link
                  href={`/elections?state=${encodeURIComponent(el.state)}`}
                  key={el.id}
                  className="block rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 group"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    background: `linear-gradient(135deg, ${color}08, rgba(14,21,40,0.9))`,
                    borderColor: `${color}25`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: `${color}20`, color, fontFamily: 'Rajdhani, sans-serif', borderColor: `${color}30`, border: '1px solid' }}>
                        {TYPE_LABELS[el.type] || '🗳️ Election'}
                      </span>
                    </div>
                    {!isPast && (
                      <span className="text-2xl font-black" style={{ color, fontFamily: 'Bebas Neue, sans-serif' }}>
                        {daysLeft}D
                      </span>
                    )}
                  </div>

                  <h3 className="text-white font-bold text-base mb-1 group-hover:text-saffron-300 transition-colors"
                    style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '16px' }}>
                    {el.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400" style={{ fontFamily: 'Hind, sans-serif' }}>
                      📅 {format(new Date(el.election_date), 'dd MMM yyyy')}
                    </span>
                    {isPast ? (
                      <span className="text-xs text-gray-500 font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        Election Held
                      </span>
                    ) : (
                      <span className="text-xs font-bold" style={{ color, fontFamily: 'Rajdhani, sans-serif' }}>
                        {daysLeft} days left →
                      </span>
                    )}
                  </div>

                  <div className="mt-3 h-0.5 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-700 group-hover:w-full"
                      style={{ width: '0%', background: color }} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
