import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://krishnapalsendhav.netlify.app/'),
  title: 'Krishnapal Sendhav | Software Developer',
  description:
    'Flutter, backend, and AI-powered application developer. Building performant apps, scalable backends, and AI-driven user experiences.',
  keywords: [
    'Flutter Developer',
    'Backend Developer',
    'AI Integration',
    'Software Engineer',
    'Cross-Platform Apps',
    'Krishnapal Sendhav',
    'Indore',
  ],
  authors: [{ name: 'Krishnapal Sendhav', url: 'https://krishnapalsendhav.netlify.app/' }],
  creator: 'Krishnapal Sendhav',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krishnapalsendhav.netlify.app/',
    siteName: 'Krishnapal Sendhav',
    title: 'Krishnapal Sendhav | Software Developer',
    description:
      'Flutter, backend, and AI-powered application developer. Building performant apps, scalable backends, and AI-driven user experiences.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Krishnapal Sendhav' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishnapal Sendhav | Software Developer',
    description:
      'Flutter, backend, and AI-powered application developer.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Malinton is served locally from /public/fonts/ */}
        {/* Must run synchronously before browser restores scroll position */}
        <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual';document.documentElement.scrollTop=0;document.body.scrollTop=0;" }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
