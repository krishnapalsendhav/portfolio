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
  title: 'Krishnapal Sendhav | Senior Flutter Developer',
  description: 'Senior Flutter Developer at ClassIO, building innovative mobile experiences serving 50,000+ users. Expert in Flutter, JavaScript, Node.js, and real-time application development.',
  keywords: ['Flutter Developer', 'Mobile App Developer', 'Senior Software Developer', 'React Native', 'Node.js', 'Krishnapal Sendhav'],
  authors: [{ name: 'Krishnapal Sendhav' }],
  creator: 'Krishnapal Sendhav',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krishnapal.dev',
    siteName: 'Krishnapal Sendhav Portfolio',
    title: 'Krishnapal Sendhav | Senior Flutter Developer',
    description: 'Senior Flutter Developer building innovative mobile experiences serving 50,000+ users.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishnapal Sendhav | Senior Flutter Developer',
    description: 'Senior Flutter Developer building innovative mobile experiences serving 50,000+ users.',
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
