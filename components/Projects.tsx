'use client';

import React from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    MotionValue,
} from 'framer-motion';
import { useRef, useState, MouseEvent } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './Projects.module.css';
import { projects } from '@/lib/data/projects';
import type { ProjectData } from '@/lib/data/projects';

const ProjectsThreeBackground = dynamic(
    () => import('./ProjectsThreeBackground'),
    { ssr: false }
);

// ── Per-card props ────────────────────────────────────────────────────
interface ProjectCardProps {
    project: ProjectData;
    index: number;
    total: number;
    scrollYProgress: MotionValue<number>;
}

// ── Card component ────────────────────────────────────────────────────
function ProjectCard({ project, index, total, scrollYProgress }: ProjectCardProps) {
    const router = useRouter();

    const seg = 1 / total;
    const isFirst = index === 0;
    const isLast = index === total - 1;

    // Entry window: card i starts entering 30% before its slot
    // First card already starts in place so we use a tiny negative to avoid
    // identical input points in useTransform.
    const entryStart = isFirst ? -0.01 : Math.max(0, (index - 0.3) * seg);
    const entryDone = index * seg;

    // Exit window (non-last cards only)
    const exitStart = (index + 0.65) * seg;
    const exitDone = Math.min((index + 1) * seg, 1);

    // Slide up from 80 px below; first card is already in place
    const y = useTransform(
        scrollYProgress,
        [entryStart, Math.max(entryDone, entryStart + 0.001)],
        [isFirst ? 0 : 80, 0],
    );

    // Opacity: fade-in on entry + fade-out on exit (last card keeps opacity=1)
    const opacityInputs: number[] = isLast
        ? [entryStart, Math.max(entryDone, entryStart + 0.001)]
        : [entryStart, Math.max(entryDone, entryStart + 0.001), exitStart, exitDone];
    const opacityOutputs: number[] = isLast
        ? [isFirst ? 1 : 0, 1]
        : [isFirst ? 1 : 0, 1, 1, 0];
    const opacity = useTransform(scrollYProgress, opacityInputs, opacityOutputs);

    // Scale: current card shrinks slightly as next one enters
    const scale = useTransform(
        scrollYProgress,
        [isLast ? 0.9999 : exitStart, isLast ? 1 : exitDone],
        [1, isLast ? 1 : 0.94],
    );

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        target.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <motion.div
            className={styles.projectCard}
            style={{ y, opacity, scale, zIndex: index }}
        >
            <div
                className={styles.projectCardInner}
                onMouseMove={handleMouseMove}
            >
                <div className={styles.projectGlow} />

                {/* Left panel */}
                <div className={styles.projectLeft}>
                    {/* Icon visual */}
                    <div className={styles.projectIconBox}>
                        {React.createElement(
                            project.icon as React.ComponentType<{ size?: number }>,
                            { size: 48 }
                        )}
                    </div>

                    <div className={styles.projectMeta}>
                        <span className={styles.projectIndex}>
                            {String(index + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
                        </span>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        {project.stats && (
                            <span className={styles.projectStats}>{project.stats}</span>
                        )}
                    </div>

                    <div className={styles.projectTags}>
                        {project.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Right panel */}
                <div className={styles.projectRight}>
                    <p className={styles.projectDescription}>{project.oneLiner}</p>

                    {project.highlights && project.highlights.length > 0 && (
                        <div className={styles.projectHighlights}>
                            {project.highlights.slice(0, 3).map((h, i) => (
                                <div key={i} className={styles.highlight}>
                                    <span className={styles.highlightDot} />
                                    {h}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.projectFooter}>
                        <button
                            className={styles.caseStudyBtn}
                            onClick={() => router.push(`/projects/${project.id}`)}
                        >
                            View Case Study
                            <FiArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ── Section ───────────────────────────────────────────────────────────
export default function Projects() {
    const trackRef = useRef<HTMLDivElement>(null);
    const total = projects.length;
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start start', 'end end'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        setActiveIndex(Math.min(Math.floor(v * total), total - 1));
    });

    return (
        <section id="projects" className={`section ${styles.projects}`}>
            <ProjectsThreeBackground />

            {/* ── Header (normal flow, scrolls away before sticky zone) ── */}
            <div className={`container ${styles.content}`}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                    <span className="section-label">Work</span>
                    <h2 className="section-title">Featured Projects</h2>
                    <p className="section-subtitle">
                        Production systems built with engineering depth — real users, real scale, real impact.
                    </p>
                </motion.div>
            </div>

            {/* ── Scroll track: N × 80 vh tall, sticky viewport inside ── */}
            <div
                ref={trackRef}
                className={styles.stickyTrack}
                style={{ height: `${total * 80}vh` }}
            >
                <div className={styles.stickyViewport}>
                    {/* Progress dots */}
                    <div className={styles.progressDots}>
                        {projects.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.progressDot}${i === activeIndex ? ` ${styles.progressDotActive}` : ''}`}
                            />
                        ))}
                    </div>

                    {/* One card per project, absolutely stacked */}
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            total={total}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
