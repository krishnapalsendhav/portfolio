'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    as?: 'a' | 'button';
    href?: string;
    target?: string;
    rel?: string;
    strength?: number;
    onClick?: () => void;
}

export default function MagneticButton({
    children,
    className = '',
    as = 'button',
    href,
    target,
    rel,
    strength = 0.3,
    onClick,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 200, damping: 20 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        x.set(distX * strength);
        y.set(distY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const MotionComponent = as === 'a' ? motion.a : motion.button;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
                display: 'inline-block',
            }}
        >
            <MotionComponent
                className={className}
                style={{
                    x: springX,
                    y: springY,
                    display: 'inline-flex',
                }}
                href={as === 'a' ? href : undefined}
                target={as === 'a' ? target : undefined}
                rel={as === 'a' ? rel : undefined}
                onClick={onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    boxShadow: isHovered
                        ? '0 20px 50px rgba(0, 245, 255, 0.25)'
                        : '0 0 0 rgba(0, 245, 255, 0)',
                }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </MotionComponent>
        </motion.div>
    );
}
