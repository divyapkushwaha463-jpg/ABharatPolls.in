'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STAT_TARGETS = [
  { label: 'Total Votes', value: 847326, suffix: '+' },
  { label: 'Active Polls', value: 24, suffix: '' },
  { label: 'States Covered', value: 28, suffix: '' },
  { label: 'Daily Voters', value: 12400, suffix: '+' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count >= 100000
        ? `${(count / 100000).toFixed(1)}L`
        : count >= 1000
        ? `${(count / 1000).toFixed(0)}K`
        : count}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-8">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Geometric shapes */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #FF6B1A 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, #138808 0%, transparent 70%)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,107,26,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-sm font-bold"
              style={{
                borderColor: 'rgba(255,107,26,0.3)',
                background: 'rgba(255,107,26,0.08)',
                color: '#FF8C42',
                fontFamily: 'Rajdhani, sans-serif',
              }}>
              <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
              🇮🇳 India&apos;s #1 Political Opinion Platform
            </div>

            {/* Headline */}
            <h1 className="mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif', lineHeight: 1 }}>
              <span className="block text-5xl sm:text-7xl lg:text-8xl text-white tracking-wide">
                BHARAT
              </span>
              <span className="block text-5xl sm:text-7xl lg:text-8xl tracking-wide" style={{ color: '#FF6B1A' }}>
                POLLS
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-300 tracking-widest mt-1">
                आपकी आवाज़, आपका वोट
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-xl mb-8 leading-relaxed" style={{ fontFamily: 'Hind, sans-serif' }}>
              Real-time political polls, election predictions, and public opinion — 
              all powered by millions of Indian voters like you.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="/elections"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-saffron"
                style={{
                  background: 'linear-gradient(135deg, #FF6B1A, #FF8C42)',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                🗳️ Vote in Latest Polls
              </Link>
              <Link
                href="/leaders"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-lg border transition-all duration-200 hover:bg-white/5"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#E0E0E0',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                👑 Leader Rankings
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:max-w-none">
              {STAT_TARGETS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-5 border text-center"
                  style={{
                    background: 'rgba(14, 21, 40, 0.8)',
                    borderColor: 'rgba(255, 107, 26, 0.15)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    className="text-3xl sm:text-4xl font-black mb-1"
                    style={{ color: '#FF8C42', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '2px' }}
                  >
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tricolor decoration */}
            <div className="mt-5 h-1 rounded-full overflow-hidden"
              style={{ background: 'linear-gradient(90deg, #FF6B1A 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
