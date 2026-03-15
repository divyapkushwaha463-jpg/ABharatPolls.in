'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/elections', label: 'Elections', icon: '🗳️' },
    { href: '/leaders', label: 'Leaders', icon: '👤' },
    { href: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        {/* Tricolor top strip */}
        <div className="h-1 w-full" style={{background: 'linear-gradient(90deg, #FF6B1A 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)'}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #FF6B1A, #FF8C42)'}}>
                <span>🇮🇳</span>
              </div>
              <div>
                <span className="font-display text-xl tracking-wide" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '2px'}}>
                  <span className="text-gradient-saffron">BHARAT</span>
                  <span className="text-white">POLLS</span>
                </span>
                <span className="text-xs text-gray-400 block -mt-1 font-body" style={{fontFamily: 'Hind, sans-serif'}}>
                  India's Voice Platform
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  style={{fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: '15px'}}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <Link
                href="/elections"
                className="ml-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all duration-200 active:scale-95"
                style={{background: 'linear-gradient(135deg, #FF6B1A, #FF8C42)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700}}
              >
                🗳️ Vote Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-dark-800 border-l border-white/10 transition-transform duration-300 pt-20 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-4 py-4 flex flex-col gap-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  pathname === link.href
                    ? 'bg-saffron-500/20 text-saffron-400'
                    : 'text-gray-200 hover:bg-white/5'
                }`}
                style={{fontFamily: 'Rajdhani, sans-serif'}}
              >
                <span className="text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href="/elections"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-white font-bold"
                style={{background: 'linear-gradient(135deg, #FF6B1A, #FF8C42)', fontFamily: 'Rajdhani, sans-serif'}}
              >
                🗳️ Vote in Latest Poll
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-17" />
    </>
  );
}
