'use client';

const TICKER_ITEMS = [
  '🔥 UP Assembly 2027 Poll LIVE — BJP leads with 47%',
  '⚡ 1.2 Lakh votes cast today on BharatPolls',
  '📊 Delhi Elections Poll — AAP vs BJP neck-to-neck',
  '🗳️ Youth Favorite Leader poll — Narendra Modi ahead',
  '🇮🇳 Bihar Assembly 2025 — NDA Alliance at 52%',
  '📈 New poll: Do you support the new agriculture policy?',
  '🔴 Breaking: Lok Sabha 2029 prediction poll is LIVE',
];

export default function NewsTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="sticky top-[65px] z-40 border-b border-white/5 overflow-hidden"
      style={{ background: 'linear-gradient(90deg, #0E1528, #141D38, #0E1528)' }}
    >
      <div className="flex items-center h-9">
        {/* Label */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 h-full text-xs font-bold uppercase tracking-widest z-10"
          style={{
            background: 'linear-gradient(135deg, #FF6B1A, #FF8C42)',
            fontFamily: 'Rajdhani, sans-serif',
            minWidth: '100px',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </div>

        {/* Scrolling text */}
        <div className="ticker-wrapper flex-1 h-full flex items-center">
          <div className="ticker-content">
            {doubled.map((item, i) => (
              <span
                key={i}
                className="text-xs text-gray-300 px-8"
                style={{ fontFamily: 'Hind, sans-serif' }}
              >
                {item}
                <span className="mx-4 text-saffron-500/40">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
