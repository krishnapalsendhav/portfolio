'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiCode, FiUsers, FiCpu, FiZap } from 'react-icons/fi';
import styles from './About.module.css';

const highlights = [
    {
        icon: FiUsers,
        title: '50,000+',
        description: 'Active Users',
    },
    {
        icon: FiCpu,
        title: 'On-Device',
        description: 'AI Integration',
    },
    {
        icon: FiCode,
        title: 'Full-Stack',
        description: 'Development',
    },
    {
        icon: FiZap,
        title: 'Real-time',
        description: 'Features Expert',
    },
];

// Floating code symbols
const codeSymbols = ['<', '/>', '{', '}', '()', '[]', '=>', '&&', '||', '...'];

export default function About() {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <section id="about" ref={containerRef} className={`section ${styles.about}`}>
            {/* Floating Code Symbols */}
            <div className={styles.floatingElements}>
                {codeSymbols.map((symbol, index) => (
                    <motion.span
                        key={index}
                        className={styles.codeSymbol}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        style={{
                            left: `${10 + (index * 9)}%`,
                            top: `${15 + (index % 5) * 18}%`,
                            animationDelay: `${index * 0.5}s`,
                        }}
                    >
                        {symbol}
                    </motion.span>
                ))}
            </div>

            {/* Animated Gradient Orbs */}
            <motion.div className={styles.gradientOrb1} style={{ y: y1 }} />
            <motion.div className={styles.gradientOrb2} style={{ y: y2 }} />
            <motion.div className={styles.gradientOrb3} style={{ rotate }} />

            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className={styles.journeyLabel}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        About Me
                    </motion.span>
                    <h2 className="section-title">Flutter Developer</h2>
                    <p className="section-subtitle">
                        Building production-ready mobile apps with 2+ years of experience
                    </p>
                </motion.div>

                <div className={styles.content}>
                    <motion.div
                        className={styles.textContent}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <p className={styles.bio}>
                            I&apos;m a Flutter developer with <span className={styles.highlight}>2+ years of experience</span> building
                            production-ready mobile apps for students and institutions. I focus on clean architecture,
                            performance, and long-term maintainability.
                        </p>
                        <div className={styles.achievementsList}>
                            <div className={styles.achievementItem}>
                                <span className={styles.achievementDot} />
                                Large-scale student apps (<span className={styles.highlight}>50K+ users</span>)
                            </div>
                            <div className={styles.achievementItem}>
                                <span className={styles.achievementDot} />
                                Real-time systems (chat, polls, live classes)
                            </div>
                            <div className={styles.achievementItem}>
                                <span className={styles.achievementDot} />
                                Custom DRM and secure content delivery
                            </div>
                            <div className={styles.achievementItem}>
                                <span className={styles.achievementDot} />
                                AI-powered features and automation
                            </div>
                        </div>
                    </motion.div>

                    <div className={styles.highlights}>
                        {highlights.map((item, index) => (
                            <motion.div
                                key={item.title}
                                className={`glass-card ${styles.highlightCard}`}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 0 40px rgba(0, 245, 255, 0.3)'
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                                >
                                    <item.icon className={styles.highlightIcon} />
                                </motion.div>
                                <h3 className={styles.highlightTitle}>{item.title}</h3>
                                <p className={styles.highlightDesc}>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
