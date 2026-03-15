'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiUsers, FiSmartphone, FiLayout, FiVideo, FiCpu, FiMessageCircle, FiUpload, FiUploadCloud, FiPackage, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import ParallaxCard from './ParallaxCard';
import styles from './Projects.module.css';

import { projects } from '@/lib/data/projects';

// Tech icons for floating effect
const floatingIcons = ['⚛️', '🚀', '💡', '⚡', '🔮', '✨', '🎯', '💫'];

export default function Projects() {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const router = useRouter();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const rotateReverse = useTransform(scrollYProgress, [0, 1], [360, 0]);
    const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);

    return (
        <section id="projects" ref={containerRef} className={`section ${styles.projects}`}>
            {/* Orbital Rings */}
            <div className={styles.orbitalContainer}>
                <motion.div className={styles.orbitalRing1} style={{ rotate }} />
                <motion.div className={styles.orbitalRing2} style={{ rotate: rotateReverse }} />
                <motion.div className={styles.orbitalRing3} style={{ rotate }} />
            </div>

            {/* Floating Icons */}
            <div className={styles.floatingIcons}>
                {floatingIcons.map((icon, index) => (
                    <motion.span
                        key={index}
                        className={styles.floatingIcon}
                        style={{
                            left: `${8 + index * 12}%`,
                            top: `${15 + (index % 4) * 20}%`,
                            animationDelay: `${index * 0.7}s`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 0.6, scale: 1 } : {}}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        {icon}
                    </motion.span>
                ))}
            </div>

            {/* Gradient Orb */}
            <motion.div className={styles.gradientOrb} style={{ y: y1 }} />

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
                        Chapter 03
                    </motion.span>
                    <h2 className="section-title">The Creations</h2>
                    <p className="section-subtitle">
                        Impactful projects I&apos;ve built that make a difference
                    </p>
                </motion.div>

                <div className={styles.projectsGrid}>
                    {projects.map((project, index) => (
                        <ParallaxCard
                            key={project.title}
                            intensity={0.08 + (index % 3) * 0.04}
                        >
                            <motion.div
                                className={`glass-card ${styles.projectCard}`}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Glow trail effect */}
                                <div className={styles.glowTrail} />

                                <div className={styles.projectHeader}>
                                    <motion.div
                                        className={styles.projectIcon}
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                                    >
                                        <project.icon />
                                    </motion.div>
                                    <span className={styles.projectStats}>{project.stats}</span>
                                </div>

                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                <p className={styles.projectDescription}>{project.oneLiner}</p>

                                <div className={styles.projectHighlights}>
                                    {project.highlights.map((highlight, i) => (
                                        <motion.div
                                            key={i}
                                            className={styles.highlight}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: index * 0.1 + i * 0.05 }}
                                        >
                                            <span className={styles.highlightDot} />
                                            {highlight}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className={styles.projectTags}>
                                    {project.tags.map((tag) => (
                                        <span key={tag} className={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <motion.button
                                    className={styles.caseStudyBtn}
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    data-cursor
                                    data-cursor-text="View"
                                >
                                    View Case Study
                                    <FiArrowRight />
                                </motion.button>
                            </motion.div>
                        </ParallaxCard>
                    ))}
                </div>
            </div>

        </section>
    );
}
