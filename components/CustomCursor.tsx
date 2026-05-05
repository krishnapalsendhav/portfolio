'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

// Ring trails with a soft spring; dot snaps to exact position
const RING_SPRING = { damping: 26, stiffness: 200, mass: 0.7 };
const DOT_TRANSITION = { duration: 0.12, ease: [0.4, 0, 0.2, 1] as const };
const RING_TRANSITION = { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const };

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isHidden, setIsHidden] = useState(true);   // hidden until first move
    const [cursorText, setCursorText] = useState('');

    const rawX = useMotionValue(-200);
    const rawY = useMotionValue(-200);
    const ringX = useSpring(rawX, RING_SPRING);
    const ringY = useSpring(rawY, RING_SPRING);

    useEffect(() => {
        let firstMove = true;

        const onMove = (e: MouseEvent) => {
            rawX.set(e.clientX);
            rawY.set(e.clientY);
            if (firstMove) { firstMove = false; setIsHidden(false); }

            const target = e.target as HTMLElement;
            const el = target.closest<HTMLElement>(
                '[data-cursor], a, button, [role="button"]',
            );
            if (el) {
                setIsHovering(true);
                setCursorText(el.getAttribute('data-cursor-text') ?? '');
            } else {
                setIsHovering(false);
                setCursorText('');
            }
        };

        const onLeave = () => setIsHidden(true);
        const onEnter = () => { if (!firstMove) setIsHidden(false); };
        const onDown = () => setIsClicking(true);
        const onUp = () => setIsClicking(false);

        window.addEventListener('mousemove', onMove, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave);
        document.documentElement.addEventListener('mouseenter', onEnter);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            document.documentElement.removeEventListener('mouseenter', onEnter);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
        };
    }, [rawX, rawY]);

    return (
        <>
            {/* Lagged outer ring — scales via Framer to avoid layout reflow */}
            <motion.div
                className={`${styles.ring} ${isHovering ? styles.ringHovering : ''}`}
                style={{ x: ringX, y: ringY }}
                animate={{
                    opacity: isHidden ? 0 : 1,
                    // 1 → normal (36px), ~1.72 → hover (≈62px), 0.72 → click
                    scale: isClicking ? 0.72 : isHovering ? 1.72 : 1,
                }}
                transition={RING_TRANSITION}
            >
                {cursorText && (
                    <span className={styles.cursorText}>{cursorText}</span>
                )}
            </motion.div>

            {/* Precision dot — instant, kiwi-green, vanishes on hover */}
            <motion.div
                className={styles.dot}
                style={{ x: rawX, y: rawY }}
                animate={{
                    opacity: isHidden ? 0 : 1,
                    scale: isClicking ? 0.4 : isHovering ? 0 : 1,
                }}
                transition={DOT_TRANSITION}
            />
        </>
    );
}
