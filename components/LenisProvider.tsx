'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        // Force scroll position to top — browser may restore position before this runs
        lenis.scrollTo(0, { immediate: true });

        lenisRef.current = lenis;

        let rafId: number;

        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        // Expose lenis to window for GSAP ScrollTrigger
        (window as unknown as { lenis: Lenis }).lenis = lenis;

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
