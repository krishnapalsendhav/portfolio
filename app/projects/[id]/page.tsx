'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import LenisProvider from '@/components/LenisProvider';
import styles from './page.module.css';

// Dynamic import for custom cursor to avoid SSR issues
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
  ssr: false,
});

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // React `use()` unwraps the params
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Find current project
    const projectIndex = projects.findIndex((p) => p.id === id);
    const project = projects[projectIndex];

    if (!project) {
        return (
            <div className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>Project Not Found</h1>
            </div>
        );
    }

    const nextProject = projects[(projectIndex + 1) % projects.length];
    const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <LenisProvider>
            <main className={styles.main}>
                <CustomCursor />
                <div className="noise-overlay" />
                
                {/* Decorative Elements */}
                <div className={styles.gradientOrb1} />
                <div className={styles.gradientOrb2} />

                {/* Header Container */}
                <div className={styles.headerContainer}>
                    <button 
                        onClick={() => router.push('/#projects')}
                        className={styles.backButton}
                        aria-label="Back to projects"
                        data-cursor
                    >
                        <FiArrowLeft size={24} />
                    </button>

                    <motion.span
                        className={styles.stats}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {project.stats}
                    </motion.span>

                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {project.title}
                    </motion.h1>

                    <motion.p
                        className={styles.oneLiner}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {project.oneLiner}
                    </motion.p>

                    <motion.div
                        className={styles.tags}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {project.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Content Container */}
                <div className={styles.contentContainer}>
                    <motion.div
                        className={styles.caseStudy}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {/* Summary / Challenge */}
                        {project.problemStatement && (
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>The Challenge</h3>
                                <p className={styles.sectionText}>{project.problemStatement}</p>
                            </div>
                        )}

                        {/* Solution */}
                        {project.solution && (
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>The Solution</h3>
                                <p className={styles.sectionText}>{project.solution}</p>
                            </div>
                        )}

                        {/* Metrics Grid */}
                        {project.metrics && project.metrics.length > 0 && (
                            <div className={styles.metricsGrid}>
                                {project.metrics.map((metric, index) => {
                                    const Icon = metric.icon;
                                    return (
                                        <motion.div
                                            key={metric.label}
                                            className={styles.metricCard}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Icon className={styles.metricIcon} />
                                            <span className={styles.metricValue}>{metric.value}</span>
                                            <span className={styles.metricLabel}>{metric.label}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Tech Stack */}
                        {project.techStack && project.techStack.length > 0 && (
                            <div className={styles.techSection}>
                                <h3 className={styles.sectionTitle}>Tech Stack</h3>
                                <div className={styles.techGrid}>
                                    {project.techStack.map((tech, index) => (
                                        <motion.div
                                            key={tech.name}
                                            className={styles.techItem}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <span className={styles.techName}>{tech.name}</span>
                                            <span className={styles.techCategory}>{tech.category}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Highlights */}
                        {project.highlights && project.highlights.length > 0 && (
                            <div className={styles.highlights}>
                                <h3 className={styles.sectionTitle}>Key Highlights</h3>
                                <ul className={styles.highlightsList}>
                                    {project.highlights.map((highlight, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className={styles.highlightDot} />
                                            {highlight}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Next / Prev Navigation */}
                        <div className={styles.navigation}>
                            <Link href={`/projects/${prevProject.id}`} className={styles.navButton} data-cursor>
                                <FiArrowLeft className={styles.navIconLeft} />
                                Previous: {prevProject.title.length > 15 ? prevProject.title.substring(0, 15) + '...' : prevProject.title}
                            </Link>

                            <Link href={`/projects/${nextProject.id}`} className={styles.navButton} data-cursor>
                                Next: {nextProject.title.length > 15 ? nextProject.title.substring(0, 15) + '...' : nextProject.title}
                                <FiArrowRight className={styles.navIconRight} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </LenisProvider>
    );
}
