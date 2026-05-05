'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import { SiOpenai } from 'react-icons/si';
import { FiCode, FiServer, FiDatabase, FiCpu, FiGitBranch } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import styles from './Skills.module.css';

const SkillsTechCanvas = dynamic(() => import('./SkillsTechCanvas'), { ssr: false });

const skillCategories = [
    {
        icon: FiCode,
        title: 'Mobile Development',
        description: 'Production-scale cross-platform',
        items: [
            'Flutter — production apps at 50K+ scale',
            'Dart — performance-focused UI & state',
            'Mobile architecture & modular design',
            'Android, iOS, Windows, macOS delivery',
        ],
    },
    {
        icon: FiCpu,
        title: 'Architecture & Systems',
        description: 'Engineering judgment at scale',
        items: [
            'Clean Architecture for maintainability',
            'Feature-based modular design patterns',
            'State management at enterprise scale',
            'Security protocols & custom DRM',
        ],
    },
    {
        icon: FiServer,
        title: 'Backend & APIs',
        description: 'Cloud infrastructure & real-time',
        items: [
            'Production REST APIs for engagement platforms',
            'Real-time systems via Firebase & WebSockets',
            'Live session state & participant management',
            'Event-driven notification infrastructure',
        ],
    },
    {
        icon: SiOpenai,
        title: 'AI / LLM Integration',
        description: 'Production-ready AI engineering',
        items: [
            'On-device AI for low-latency mobile features',
            'LLM orchestration in production apps',
            'LangChain-based RAG implementations',
            'AI pipelines for automated media processing',
        ],
    },
    {
        icon: FiDatabase,
        title: 'Languages',
        description: 'Applied proficiency across the stack',
        items: [
            'Dart — primary, core production work',
            'Python — AI automation & pipelines',
            'JavaScript / TypeScript — web & integration',
            'Java — backend tooling & services',
        ],
    },
    {
        icon: FiGitBranch,
        title: 'Delivery & Workflow',
        description: 'Release governance & ownership',
        items: [
            'End-to-end App Store & Play Store delivery',
            'Release coordination with product milestones',
            'Crash management & post-release iteration',
            'Cross-functional team collaboration',
        ],
    },
];

const ease = [0.4, 0, 0.2, 1] as const;

export default function Skills() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section id="skills" className={`section ${styles.skills}`}>
            <div className="container">
                {/* Header */}
                <motion.div
                    ref={ref}
                    className={styles.header}
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, ease }}
                >
                    <span className="section-label">Expertise</span>
                    <h2 className="section-title">Engineering & Architecture</h2>
                    <p className="section-subtitle">
                        Building production-grade systems with focus on scale, performance, and long-term maintainability.
                    </p>
                </motion.div>

                {/* Categories */}
                <div className={styles.categories}>
                    {skillCategories.map((cat, i) => (
                        <motion.div
                            key={cat.title}
                            className={styles.category}
                            onMouseMove={handleMouseMove}
                            initial={{ opacity: 0, y: 24 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease }}
                        >
                            <div className={styles.categoryGlow} />
                            <div className={styles.categoryContent}>
                                <div className={styles.categoryHeader}>
                                    <div className={styles.iconBox}>
                                        <cat.icon size={14} />
                                    </div>
                                    <div className={styles.headerText}>
                                        <h3 className={styles.categoryTitle}>{cat.title}</h3>
                                        <p className={styles.categoryDescription}>{cat.description}</p>
                                    </div>
                                </div>

                                <ul className={styles.skillList}>
                                    {cat.items.map((item, j) => (
                                        <motion.li
                                            key={j}
                                            className={styles.skillItem}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ duration: 0.3, delay: 0.15 + i * 0.07 + j * 0.04, ease }}
                                        >
                                            <span className={styles.bullet} />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tech constellation viewport */}
                <motion.div
                    className={styles.techRow}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6, ease }}
                >
                    <div className={styles.techRowHeader}>
                        <span className={styles.techRowLabel}>Technology Map</span>
                        <span className={styles.techRowMeta}>Fibonacci sphere — 12 nodes · 200 stars</span>
                    </div>
                    <SkillsTechCanvas />
                </motion.div>
            </div>
        </section>
    );
}
