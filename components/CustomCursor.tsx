'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [cursorText, setCursorText] = useState('');

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseEnter = () => setIsHidden(false);
        const handleMouseLeave = () => setIsHidden(true);

        // Track hoverable elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const hoverableElement = target.closest('[data-cursor]');

            if (hoverableElement) {
                setIsHovering(true);
                const text = hoverableElement.getAttribute('data-cursor-text') || '';
                setCursorText(text);
            } else {
                setIsHovering(false);
                setCursorText('');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousemove', handleElementHover);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousemove', handleElementHover);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [cursorX, cursorY]);

    // Hide on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return null;
    }

    return (
        <>
            {/* Main cursor */}
            <motion.div
                ref={cursorRef}
                className={`${styles.cursor} ${isHovering ? styles.hovering : ''} ${isHidden ? styles.hidden : ''}`}
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                {cursorText && <span className={styles.cursorText}>{cursorText}</span>}
            </motion.div>

            {/* Cursor dot */}
            <motion.div
                className={`${styles.cursorDot} ${isHidden ? styles.hidden : ''}`}
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
            />
        </>
    );
}
