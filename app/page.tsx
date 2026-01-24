'use client';

import dynamic from 'next/dynamic';
import LenisProvider from '@/components/LenisProvider';
import NavigationNew from '@/components/NavigationNew';
import HeroNew from '@/components/HeroNew';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';

// Dynamic import for custom cursor to avoid SSR issues
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
  ssr: false,
});

// Dynamic import for chat widget to avoid SSR issues
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
});

export default function Home() {
  return (
    <LenisProvider>
      <main>
        <CustomCursor />
        <div className="noise-overlay" />
        <NavigationNew />
        <HeroNew />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
        <ChatWidget />
      </main>
    </LenisProvider>
  );
}
