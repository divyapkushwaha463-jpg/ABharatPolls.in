import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BharatPolls.in – India\'s Public Opinion Poll Platform',
  description: 'Vote in real-time political polls. Track election trends, leader popularity, and youth opinion across India.',
  keywords: 'India polls, election polls, political survey, UP election 2027, BJP polls, India political opinion, BharatPolls',
  openGraph: {
    title: 'BharatPolls.in 🇮🇳',
    description: "India's Most Trusted Public Opinion Platform",
    url: 'https://bharatpolls.in',
    siteName: 'BharatPolls',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatPolls.in 🇮🇳',
    description: "Vote now in India's live political polls",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF6B1A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Hind:wght@300;400;500;600&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-dark-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
