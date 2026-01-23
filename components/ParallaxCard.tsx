'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export default function ParallaxCard({
    children,
    className = '',
    intensity = 0.1,
}: ParallaxCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100 * intensity, -100 * intensity]);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ y }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
            {children}
        </motion.div>
    );
}
