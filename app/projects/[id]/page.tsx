'use client';

import { use, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import LenisProvider from '@/components/LenisProvider';
import styles from './page.module.css';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });

const ease = [0.4, 0, 0.2, 1] as const;

// ── Scroll-reveal section wrapper ───────────────────────────────────────────
function RevealSection({ label, title, children }: { label: string; title: string; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px 0px' });
    return (
        <motion.div
            ref={ref}
            className={styles.section}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
        >
            <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>{label}</span>
                <h2 className={styles.sectionTitle}>{title}</h2>
            </div>
            <div className={styles.sectionBody}>{children}</div>
        </motion.div>
    );
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [mounted, setMounted] = useState(false);

    // Scroll progress bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 38, restDelta: 0.001 });

    useEffect(() => { setMounted(true); }, []);

    const projectIndex = projects.findIndex((p) => p.id === id);
    const project = projects[projectIndex];

    if (!project) {
        return (
            <div className={styles.notFound}>
                <h1>Project Not Found</h1>
            </div>
        );
    }

    const nextProject = projects[(projectIndex + 1) % projects.length];
    const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];
    const indexLabel = String(projectIndex + 1).padStart(2, '0');

    if (!mounted) return null;

    return (
        <LenisProvider>
            <main className={styles.main}>
                <CustomCursor />
                <div className="noise-overlay" />

                {/* Scroll progress bar */}
                <motion.div className={styles.progressBar} style={{ scaleX }} />

                {/* ── Hero ─────────────────────────────────────────── */}
                <section className={styles.hero}>
                    <motion.button
                        className={styles.backButton}
                        onClick={() => router.push('/#projects')}
                        aria-label="Back to projects"
                        data-cursor
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease }}
                    >
                        <FiArrowLeft size={14} />
                        <span>Projects</span>
                    </motion.button>

                    {/* Large faded project index */}
                    <motion.span
                        className={styles.heroIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.0, ease }}
                    >
                        {indexLabel}
                    </motion.span>

                    <div className={styles.heroBody}>
                        <span className={styles.heroAccent} />
                        <motion.span
                            className={styles.heroStats}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.06, ease }}
                        >
                            {project.stats}
                        </motion.span>

                        <motion.h1
                            className={styles.heroTitle}
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.12, ease }}
                        >
                            {project.title}
                        </motion.h1>

                        <motion.p
                            className={styles.heroOneLiner}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease }}
                        >
                            {project.oneLiner}
                        </motion.p>

                        <motion.div
                            className={styles.heroTags}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.3, ease }}
                        >
                            {project.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        className={styles.heroDivider}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.75, delay: 0.38, ease }}
                    />
                </section>

                {/* ── Body ─────────────────────────────────────────── */}
                <div className={styles.body}>

                    {/* Sticky sidebar — desktop only */}
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarSticky}>
                            <span className={styles.sidebarIndex}>{indexLabel}</span>
                            <div className={styles.sidebarDivider} />
                            <div className={styles.sidebarNav}>
                                <Link
                                    href={`/projects/${prevProject.id}`}
                                    className={styles.sideNavBtn}
                                    data-cursor
                                    aria-label="Previous project"
                                >
                                    <FiArrowLeft size={13} />
                                </Link>
                                <Link
                                    href={`/projects/${nextProject.id}`}
                                    className={styles.sideNavBtn}
                                    data-cursor
                                    aria-label="Next project"
                                >
                                    <FiArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main case-study content */}
                    <div className={styles.content}>

                        {project.problemStatement && (
                            <RevealSection label="01" title="The Challenge">
                                <p className={styles.bodyText}>{project.problemStatement}</p>
                            </RevealSection>
                        )}

                        {project.solution && (
                            <RevealSection label="02" title="The Solution">
                                <p className={styles.bodyText}>{project.solution}</p>
                            </RevealSection>
                        )}

                        {project.metrics && project.metrics.length > 0 && (
                            <RevealSection label="03" title="Impact">
                                <div className={styles.metricsGrid}>
                                    {project.metrics.map((metric, i) => {
                                        const Icon = metric.icon;
                                        return (
                                            <motion.div
                                                key={metric.label}
                                                className={styles.metricCard}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: '-40px' }}
                                                transition={{ duration: 0.4, delay: i * 0.08, ease }}
                                            >
                                                <Icon className={styles.metricIcon} />
                                                <span className={styles.metricValue}>{metric.value}</span>
                                                <span className={styles.metricLabel}>{metric.label}</span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </RevealSection>
                        )}

                        {project.techStack && project.techStack.length > 0 && (
                            <RevealSection label="04" title="Tech Stack">
                                <div className={styles.techRow}>
                                    {project.techStack.map((tech, i) => (
                                        <motion.div
                                            key={tech.name}
                                            className={styles.techPill}
                                            initial={{ opacity: 0, scale: 0.88 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.28, delay: i * 0.05, ease }}
                                        >
                                            <span className={styles.techPillName}>{tech.name}</span>
                                            <span className={styles.techPillCat}>{tech.category}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </RevealSection>
                        )}

                        {project.highlights && project.highlights.length > 0 && (
                            <RevealSection label="05" title="Key Highlights">
                                <ul className={styles.highlightsList}>
                                    {project.highlights.map((h, i) => (
                                        <motion.li
                                            key={i}
                                            className={styles.highlightItem}
                                            initial={{ opacity: 0, x: -14 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.32, delay: i * 0.07, ease }}
                                        >
                                            <span className={styles.highlightLine} />
                                            {h}
                                        </motion.li>
                                    ))}
                                </ul>
                            </RevealSection>
                        )}

                        {project.links && project.links.length > 0 && (
                            <RevealSection label="06" title="Links">
                                <div className={styles.linksRow}>
                                    {project.links.map((link) => {
                                        const Icon = link.icon as React.ComponentType<{ size?: number }>;
                                        return (
                                            <motion.a
                                                key={link.label}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.linkBtn}
                                                data-cursor
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, ease }}
                                            >
                                                <Icon size={13} />
                                                {link.label}
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </RevealSection>
                        )}

                    </div>
                </div>

                {/* ── Next Project Teaser ───────────────────────────── */}
                <Link href={`/projects/${nextProject.id}`} className={styles.nextTeaser} data-cursor>
                    <div className={styles.nextTeaserInner}>
                        <span className={styles.nextLabel}>Next Project</span>
                        <div className={styles.nextTitleRow}>
                            <span className={styles.nextTitle}>{nextProject.title}</span>
                            <FiArrowRight className={styles.nextArrow} />
                        </div>
                        <span className={styles.nextOneLiner}>{nextProject.oneLiner}</span>
                    </div>
                    <motion.div
                        className={styles.nextFill}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                </Link>

            </main>
        </LenisProvider>
    );
}

