import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5 mt-20">
      {/* Tricolor strip */}
      <div className="h-1 w-full" style={{background: 'linear-gradient(90deg, #FF6B1A 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)'}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇮🇳</span>
              <span style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '3px'}}>
                <span className="text-gradient-saffron">BHARAT</span>
                <span className="text-white">POLLS</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed" style={{fontFamily: 'Hind, sans-serif'}}>
              India's most trusted public opinion platform. Real-time political polls, 
              election predictions, and youth voice — all in one place.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://twitter.com/intent/tweet?text=Vote+on+BharatPolls.in&url=https://bharatpolls.in"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-400/20 hover:border-blue-400/30 transition-colors"
              >
                𝕏
              </a>
              <a
                href="https://wa.me/?text=Vote+in+India's+latest+political+polls+at+BharatPolls.in"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-400/20 hover:border-green-400/30 transition-colors text-lg"
              >
                📱
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/elections', label: 'Election Polls' },
                { href: '/leaders', label: 'Leader Popularity' },
                { href: '/admin', label: 'Admin Panel' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-saffron-400 text-sm transition-colors"
                    style={{fontFamily: 'Hind, sans-serif'}}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Use' },
                { href: '/contact', label: 'Contact' },
                { href: '/disclaimer', label: 'Disclaimer' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-saffron-400 text-sm transition-colors"
                    style={{fontFamily: 'Hind, sans-serif'}}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs" style={{fontFamily: 'Hind, sans-serif'}}>
            © 2026 BharatPolls.in — Made with 🇮🇳 for India
          </p>
          <p className="text-gray-600 text-xs" style={{fontFamily: 'Hind, sans-serif'}}>
            ⚠️ Polls are for opinion purposes only. Not affiliated with any political party.
          </p>
        </div>
      </div>
    </footer>
  );
}
