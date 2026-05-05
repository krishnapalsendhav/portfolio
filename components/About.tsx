'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import styles from './About.module.css';

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false });

const stats = [
    { value: '50K', accent: '+', label: 'Active Users', desc: 'Flutter apps in production at ClassIO' },
    { value: '3+', accent: '', label: 'Years', desc: 'Building real-world production systems' },
    { value: '10+', accent: '', label: 'Projects', desc: 'Cross-platform & backend delivered' },
    { value: 'AI', accent: '', label: 'Integration', desc: 'LLMs, RAG, on-device inference' },
];

const specializations = [
    'Flutter & Dart', 'Backend APIs', 'AI / LLM Integration',
    'Real-time Systems', 'Custom DRM', 'Clean Architecture',
    'Firebase', 'Mobile CI/CD', 'LangChain RAG',
];

const ease = [0.4, 0, 0.2, 1] as const;

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 24 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay, ease },
    });

    return (
        <section id="about" className={`section ${styles.about}`}>
            <div className={styles.sceneContainer}>
                <Scene3D />
            </div>
            <div className={`container ${styles.contentLayer}`}>
                {/* Section Header */}
                <motion.div className={styles.header} ref={ref} {...fadeUp(0)}>
                    <span className="section-label">About</span>
                    <h2 className="section-title">Engineering at Scale</h2>
                    <p className="section-subtitle">
                        I specialise in Flutter, backend systems, and applied AI — building production
                        applications that serve real users across Android, iOS, Windows, and macOS.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {/* Left — Bio */}
                    <motion.div {...fadeUp(0.1)}>
                        <p className={styles.bio}>
                            Based in{' '}
                            <span className={styles.highlight}>Indore, India</span>,
                            I build{' '}
                            <span className={styles.accentWord}>performant cross-platform apps</span>,
                            scalable backend services, and{' '}
                            <span className={styles.accentWord}>AI-powered workflows</span>{' '}
                            that solve real problems at scale.
                        </p>

                        <div className={styles.achievements}>
                            <div className={styles.achievementItem}>
                                Large-scale student platform serving <strong className={styles.achievementStrong}>50,000+ active users</strong>
                            </div>
                            <div className={styles.achievementItem}>
                                Real-time features: live classes, chat, polls, file sharing
                            </div>
                            <div className={styles.achievementItem}>
                                Custom DRM and encrypted content delivery pipelines
                            </div>
                            <div className={styles.achievementItem}>
                                AI-powered features using LLMs, on-device inference, and RAG systems
                            </div>
                            <div className={styles.achievementItem}>
                                End-to-end ownership: architecture, development, and App Store delivery
                            </div>
                        </div>

                        <a href="#projects" className={styles.aboutCta}>
                            View work
                            <FiArrowRight className={styles.ctaArrow} size={13} />
                        </a>
                    </motion.div>

                    {/* Right — Stat cards */}
                    <motion.div {...fadeUp(0.2)}>
                        <div className={styles.statsGrid}>
                            {stats.map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    className={styles.statCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease }}
                                >
                                    <span className={styles.statCardValue}>
                                        {s.value}
                                        <span className={styles.statCardValueAccent}>{s.accent}</span>
                                    </span>
                                    <span className={styles.statCardLabel}>{s.label}</span>
                                    <p className={styles.statCardDesc}>{s.desc}</p>
                                </motion.div>
                            ))}

                            {/* Specializations */}
                            <div className={styles.specializations}>
                                <p className={styles.specTitle}>Specializations</p>
                                <div className={styles.specList}>
                                    {specializations.map((s) => (
                                        <span key={s} className={styles.specTag}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
