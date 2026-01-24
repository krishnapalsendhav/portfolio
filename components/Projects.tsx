'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiUsers, FiSmartphone, FiLayout, FiVideo, FiCpu, FiMessageCircle, FiUpload, FiUploadCloud, FiPackage } from 'react-icons/fi';
import ParallaxCard from './ParallaxCard';
import styles from './Projects.module.css';

const projects = [
    {
        title: 'Student Learning Platform',
        oneLiner: 'A large-scale Flutter app used by 50K+ students for learning, live classes, and AI-powered doubt resolution.',
        tags: ['Flutter', 'GetX', 'Firebase', 'WebSockets', 'AI'],
        icon: FiUsers,
        stats: '50K+ Users',
        highlights: [
            '50K+ active users across institutions',
            'Real-time chat, polls, and live classes',
            'Custom DRM for secure content delivery',
            'AI-powered doubt resolution portal',
        ],
    },
    {
        title: 'Live Classes Platform',
        oneLiner: 'Real-time live class features with interactive components for enhanced student engagement.',
        tags: ['WebRTC', 'WebSockets', 'Real-time', 'Flutter'],
        icon: FiVideo,
        stats: 'Real-time',
        highlights: [
            'Low-latency video streaming',
            'Interactive polls and Q&A',
            'Real-time chat and file sharing',
            'Screen sharing capability',
        ],
    },
    {
        title: 'Content Upload & Processing Pipeline',
        oneLiner: 'End-to-end video processing pipeline for multi-quality encoding, encryption, and optimized content delivery.',
        tags: ['Video Pipeline', 'Encoding', 'Encryption', 'Cost Optimization'],
        icon: FiUploadCloud,
        stats: '35% Server Cost Reduction',
        highlights: [
            'Automated video transcoding into multiple quality variants',
            'Encrypted media processing for secure content delivery',
            'Optimized upload and storage workflow to reduce server load',
            'Designed, pitched, and implemented as a cost-optimization initiative',
        ],
    },
    {
        title: 'ClassIO Management App',
        oneLiner: 'A powerful management tool for educational institutes with AI-powered features for streamlined operations.',
        tags: ['Flutter', 'AI Assistant', 'REST API', 'Windows'],
        icon: FiSmartphone,
        stats: 'AI-Enhanced',
        highlights: [
            'AI-powered doubt portal for smart replies',
            'Automated reply suggestions for teachers',
            'Real-time analytics dashboard',
            'Multi-institute support',
        ],
    },
    {
        title: 'App Builder Feature',
        oneLiner: 'Innovative feature allowing institutes to customize app layouts directly from management interface.',
        tags: ['Flutter', 'Dynamic UI', 'JSON Config'],
        icon: FiLayout,
        stats: 'Platform Feature',
        highlights: [
            'Drag-and-drop layout customization',
            'Real-time preview of changes',
            'Theme and branding controls',
            'No-code app configuration',
        ],
    },
    {
        title: 'Video to Quiz AI Pipeline',
        oneLiner: 'End-to-end AI pipeline that automatically generates quizzes from video content for student assessment.',
        tags: ['AI/ML', 'Pipeline', 'RAG', 'On-Device AI'],
        icon: FiCpu,
        stats: 'AI-Powered',
        highlights: [
            'Automated quiz generation from videos',
            'On-device AI for privacy',
            'Intelligent question extraction',
            'Multiple question formats',
        ],
    },
    {
        title: 'AI Agentic Chatbot',
        oneLiner: 'AI-powered agentic chatbot capable of autonomous task execution and intelligent conversation handling.',
        tags: ['AI/ML', 'LLM', 'Agents', 'Tool Calling'],
        icon: FiMessageCircle,
        stats: 'In Progress',
        highlights: [
            'Autonomous task execution',
            'Context-aware conversations',
            'ClassIO ecosystem integration',
            'Multi-modal interactions',
        ],
    },
    {
        title: 'Flutter Package Engineering',
        oneLiner: 'Development and extension of Flutter packages for platform-level capabilities and system integrations.',
        tags: ['Flutter Packages', 'Platform Channels', 'Open Source', 'System Integration'],
        icon: FiPackage,
        stats: 'Multiple Packages',
        highlights: [
            'Developed and maintained Flutter packages published on pub.dev and GitHub',
            'Implemented platform-channel integrations for device and system-level access',
            'Extended and modified open-source libraries to meet production requirements',
            'Focused on stability, performance, and developer experience at package level',
        ],
    },
];

// Tech icons for floating effect
const floatingIcons = ['⚛️', '🚀', '💡', '⚡', '🔮', '✨', '🎯', '💫'];

export default function Projects() {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

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
                            </motion.div>
                        </ParallaxCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
