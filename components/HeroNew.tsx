'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FiArrowDown, FiDownload } from 'react-icons/fi';
import gsap from 'gsap';
import styles from './HeroNew.module.css';

// Dynamic import for Three.js to avoid SSR issues
const Scene3D = dynamic(() => import('./Scene3D'), {
    ssr: false,
    loading: () => <div className={styles.sceneLoader} />,
});

export default function HeroNew() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    useEffect(() => {
        // GSAP text reveal animation
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                {
                    opacity: 0,
                    y: 100,
                    filter: 'blur(20px)',
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: 0.3,
                }
            );

            gsap.fromTo(
                subtitleRef.current,
                {
                    opacity: 0,
                    y: 50,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: 0.8,
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section id="home" ref={containerRef} className={styles.hero}>
            {/* 3D Background */}
            <div className={styles.scene3d}>
                <Scene3D />
            </div>

            {/* Gradient overlay */}
            <div className={styles.gradientOverlay} />

            {/* Content */}
            <motion.div
                className={styles.content}
                style={{ y, opacity, scale }}
            >
                <motion.div
                    className={styles.badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <span className={styles.badgeDot} />
                    Open to opportunities
                </motion.div>

                <h1 ref={titleRef} className={styles.title}>
                    <span className={styles.firstName}>Krishnapal</span>
                    <span className={styles.lastName}>Sendhav</span>
                </h1>

                <div ref={subtitleRef} className={styles.subtitle}>
                    <span className={styles.tagline}>AI Engineer & Flutter Developer</span>
                    <span className={styles.taglineDivider}>|</span>
                    <span className={styles.taglineSecondary}>AI-driven Apps</span>
                </div>

                <motion.p
                    className={styles.description}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                >
                    I build scalable Flutter apps used by 50K+ users, focused on performance, privacy-first and secure AI systems.
                </motion.p>

                <motion.div
                    className={styles.cta}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                >
                    <a href="#projects" className={styles.ctaButton} data-cursor data-cursor-text="View">
                        View Projects
                    </a>
                    <a href="/Krishnapal-Sendhav-Resume.pdf" className={styles.ctaSecondary} target="_blank" rel="noopener noreferrer" data-cursor>
                        <FiDownload />
                        Download Resume
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                    opacity: { delay: 2 },
                    y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                }}
            >
                <FiArrowDown />
                <span>Scroll</span>
            </motion.div>
        </section>
    );
}
