import type { Metadata } from 'next';
import { Space_Grotesk, Outfit } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Krishnapal Sendhav | Senior Software Engineer',
  description: 'AI Engineer & Senior Software Engineer at ClassIO, building scalable, privacy-first AI systems and cross-platform applications for 50,000+ users.',
  keywords: [
    'AI Engineer',
    'Flutter Developer',
    'Full-Stack Developer',
    'Cross-Platform Applications',
    'Privacy-First AI',
    'Production AI Systems',
    'Backend Engineering',
    'Krishnapal Sendhav'
  ],
  authors: [{ name: 'Krishnapal Sendhav', url: 'https://krishnapalsendhav.netlify.app/' }],
  creator: 'Krishnapal Sendhav',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krishnapalsendhav.netlify.app/',
    siteName: 'Krishnapal Sendhav',
    title: 'Krishnapal Sendhav | Senior Software Engineer',
    description: 'AI Engineer & Senior Software Engineer at ClassIO, building scalable, privacy-first AI systems and cross-platform applications for 50,000+ users.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Krishnapal Sendhav Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishnapal Sendhav | Senior Software Engineer',
    description: 'AI Engineer & Senior Software Engineer at ClassIO, building scalable, privacy-first AI systems and cross-platform applications for 50,000+ users.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
