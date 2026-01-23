'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';

interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    blur?: boolean;
}

export default function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    blur = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const directionOffset = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 },
    };

    useEffect(() => {
        if (isInView && ref.current) {
            gsap.fromTo(
                ref.current,
                {
                    opacity: 0,
                    y: directionOffset[direction].y,
                    x: directionOffset[direction].x,
                    filter: blur ? 'blur(10px)' : 'blur(0px)',
                },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    delay,
                    ease: 'power3.out',
                }
            );
        }
    }, [isInView, delay, direction, blur]);

    return (
        <div ref={ref} style={{ opacity: 0 }}>
            {children}
        </div>
    );
}
