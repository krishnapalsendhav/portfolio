'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { FiX, FiExternalLink, FiGithub, FiUsers, FiZap, FiShield, FiCpu } from 'react-icons/fi';
import styles from './ProjectDetails.module.css';

export interface ProjectData {
    title: string;
    oneLiner: string;
    tags: string[];
    stats: string;
    highlights: string[];
    // Extended data for details view
    problemStatement?: string;
    solution?: string;
    techStack?: { name: string; category: string }[];
    metrics?: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }[];
    links?: { label: string; url: string; icon: React.ElementType }[];
}

interface ProjectDetailsProps {
    project: ProjectData | null;
    isOpen: boolean;
    onClose: () => void;
}

// Extended project data with full case study info
export const projectCaseStudies: Record<string, Partial<ProjectData>> = {
    'Student Learning Platform': {
        problemStatement: 'Educational institutions needed a unified platform for content delivery, live classes, and student engagement that could scale to tens of thousands of users while maintaining a premium experience.',
        solution: 'Built a comprehensive Flutter application with modular architecture, featuring real-time WebSocket integrations, custom DRM for content protection, and an AI-powered doubt resolution system that reduced teacher workload by 40%.',
        techStack: [
            { name: 'Flutter', category: 'Frontend' },
            { name: 'GetX', category: 'State Management' },
            { name: 'Firebase', category: 'Backend' },
            { name: 'WebSockets', category: 'Real-time' },
            { name: 'Custom DRM', category: 'Security' },
            { name: 'OpenAI', category: 'AI' },
        ],
        metrics: [
            { label: 'Active Users', value: '50,000+', icon: FiUsers },
            { label: 'Uptime', value: '99.9%', icon: FiZap },
            { label: 'Content Protected', value: '100%', icon: FiShield },
            { label: 'AI Responses', value: '10K+/day', icon: FiCpu },
        ],
    },
    'Live Classes Platform': {
        problemStatement: 'Students needed real-time interaction capabilities during live sessions including chat, polls, and Q&A without latency issues or dropped connections.',
        solution: 'Engineered a low-latency live class system using WebRTC for video streaming and WebSockets for interactive features, achieving sub-200ms response times for all user interactions.',
        techStack: [
            { name: 'WebRTC', category: 'Streaming' },
            { name: 'WebSockets', category: 'Real-time' },
            { name: 'Flutter', category: 'Frontend' },
            { name: 'Firebase RTDB', category: 'Database' },
        ],
        metrics: [
            { label: 'Latency', value: '<200ms', icon: FiZap },
            { label: 'Concurrent Users', value: '1000+', icon: FiUsers },
        ],
    },
    'Content Upload & Processing Pipeline': {
        problemStatement: 'Video content processing was expensive and slow, with high server costs and inconsistent quality across different video sources.',
        solution: 'Designed and implemented an automated video transcoding pipeline that processes uploads into multiple quality variants with encryption, reducing server costs by 35% while improving content delivery speed.',
        techStack: [
            { name: 'FFmpeg', category: 'Processing' },
            { name: 'Cloud Functions', category: 'Serverless' },
            { name: 'Cloud Storage', category: 'Storage' },
            { name: 'Custom Encryption', category: 'Security' },
        ],
        metrics: [
            { label: 'Cost Reduction', value: '35%', icon: FiZap },
            { label: 'Processing Speed', value: '3x Faster', icon: FiCpu },
        ],
    },
    'ClassIO Management App': {
        problemStatement: 'Teachers and administrators needed a powerful tool to manage content, respond to student queries, and track engagement without context switching between multiple platforms.',
        solution: 'Built a cross-platform management app with AI-powered smart replies, real-time analytics, and streamlined content management workflows that increased teacher response rates by 60%.',
        techStack: [
            { name: 'Flutter', category: 'Frontend' },
            { name: 'REST API', category: 'Backend' },
            { name: 'OpenAI', category: 'AI' },
            { name: 'Windows', category: 'Platform' },
        ],
        metrics: [
            { label: 'Response Rate', value: '+60%', icon: FiZap },
            { label: 'AI Accuracy', value: '92%', icon: FiCpu },
        ],
    },
    'App Builder Feature': {
        problemStatement: 'Different institutions wanted unique app layouts and branding but building custom apps for each was not scalable.',
        solution: 'Created a no-code app builder that allows institutes to customize layouts, themes, and features directly from the management interface with real-time preview capabilities.',
        techStack: [
            { name: 'Flutter', category: 'Frontend' },
            { name: 'JSON Config', category: 'Architecture' },
            { name: 'Dynamic UI', category: 'Rendering' },
        ],
        metrics: [
            { label: 'Customization Time', value: '10 min', icon: FiZap },
            { label: 'Institutes Using', value: '15+', icon: FiUsers },
        ],
    },
    'Video to Quiz AI Pipeline': {
        problemStatement: 'Creating quizzes from video content was time-consuming and required manual review of hours of content.',
        solution: 'Developed an end-to-end AI pipeline that automatically extracts key concepts from video content and generates contextually relevant quiz questions, reducing quiz creation time from hours to minutes.',
        techStack: [
            { name: 'Python', category: 'Backend' },
            { name: 'LangChain', category: 'AI Framework' },
            { name: 'RAG', category: 'AI Architecture' },
            { name: 'On-Device AI', category: 'Edge Computing' },
        ],
        metrics: [
            { label: 'Time Saved', value: '95%', icon: FiZap },
            { label: 'Question Accuracy', value: '88%', icon: FiCpu },
        ],
    },
    'AI Agentic Chatbot': {
        problemStatement: 'Users needed intelligent assistance that could understand context, execute tasks autonomously, and integrate seamlessly with the existing ecosystem.',
        solution: 'Building an agentic AI chatbot with tool-calling capabilities, context-aware conversations, and deep integration with the ClassIO platform for autonomous task execution.',
        techStack: [
            { name: 'LLM', category: 'AI' },
            { name: 'Tool Calling', category: 'Agents' },
            { name: 'Flutter', category: 'Frontend' },
            { name: 'WebSockets', category: 'Real-time' },
        ],
        metrics: [
            { label: 'Status', value: 'In Progress', icon: FiCpu },
        ],
    },
    'Flutter Package Engineering': {
        problemStatement: 'Production apps required platform-level capabilities not available in existing packages, and open-source solutions needed modifications for enterprise use.',
        solution: 'Developed and maintained Flutter packages for system-level access, modified open-source libraries for production requirements, and created reusable components with focus on performance and developer experience.',
        techStack: [
            { name: 'Flutter', category: 'Framework' },
            { name: 'Platform Channels', category: 'Native' },
            { name: 'Dart', category: 'Language' },
            { name: 'pub.dev', category: 'Distribution' },
        ],
        metrics: [
            { label: 'Packages', value: 'Multiple', icon: FiCpu },
        ],
    },
};

export default function ProjectDetails({ project, isOpen, onClose }: ProjectDetailsProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);

            // Save current scroll position
            const scrollY = window.scrollY;

            // Lock body scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);

            if (isOpen) {
                // Get the scroll position that was saved
                const scrollY = document.body.style.top;

                // Restore body
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';

                // Restore scroll position
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        };
    }, [isOpen, onClose]);



    // Get extended data
    const caseStudy = project ? projectCaseStudies[project.title] : null;

    return (
        <AnimatePresence>
            {isOpen && project && (
                <motion.div
                    ref={overlayRef}
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                        if (e.target === overlayRef.current) onClose();
                    }}
                >
                    {/* Backdrop blur */}
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal content */}
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Decorative gradient orbs */}
                        <div className={styles.gradientOrb1} />
                        <div className={styles.gradientOrb2} />

                        {/* Close button */}
                        <motion.button
                            className={styles.closeButton}
                            onClick={onClose}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            data-cursor
                        >
                            <FiX />
                        </motion.button>

                        {/* Header */}
                        <div className={styles.header}>
                            <motion.span
                                className={styles.stats}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {project.stats}
                            </motion.span>
                            <motion.h2
                                className={styles.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                {project.title}
                            </motion.h2>
                            <motion.p
                                className={styles.oneLiner}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {project.oneLiner}
                            </motion.p>
                        </div>

                        {/* Tags */}
                        <motion.div
                            className={styles.tags}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                        >
                            {project.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* Case Study Content */}
                        {caseStudy && (
                            <div className={styles.caseStudy}>
                                {/* Problem & Solution */}
                                <div className={styles.problemSolution}>
                                    {caseStudy.problemStatement && (
                                        <motion.div
                                            className={styles.section}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <h3 className={styles.sectionTitle}>The Challenge</h3>
                                            <p className={styles.sectionText}>{caseStudy.problemStatement}</p>
                                        </motion.div>
                                    )}
                                    {caseStudy.solution && (
                                        <motion.div
                                            className={styles.section}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <h3 className={styles.sectionTitle}>The Solution</h3>
                                            <p className={styles.sectionText}>{caseStudy.solution}</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Metrics */}
                                {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                                    <motion.div
                                        className={styles.metricsGrid}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {caseStudy.metrics.map((metric, index) => {
                                            const Icon = metric.icon;
                                            return (
                                                <motion.div
                                                    key={metric.label}
                                                    className={styles.metricCard}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.45 + index * 0.05 }}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <Icon className={styles.metricIcon} />
                                                    <span className={styles.metricValue}>{metric.value}</span>
                                                    <span className={styles.metricLabel}>{metric.label}</span>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                )}

                                {/* Tech Stack */}
                                {caseStudy.techStack && caseStudy.techStack.length > 0 && (
                                    <motion.div
                                        className={styles.techSection}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h3 className={styles.sectionTitle}>Tech Stack</h3>
                                        <div className={styles.techGrid}>
                                            {caseStudy.techStack.map((tech, index) => (
                                                <motion.div
                                                    key={tech.name}
                                                    className={styles.techItem}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.55 + index * 0.03 }}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <span className={styles.techName}>{tech.name}</span>
                                                    <span className={styles.techCategory}>{tech.category}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Highlights */}
                        <motion.div
                            className={styles.highlights}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h3 className={styles.sectionTitle}>Key Highlights</h3>
                            <ul className={styles.highlightsList}>
                                {project.highlights.map((highlight, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.65 + index * 0.05 }}
                                    >
                                        <span className={styles.highlightDot} />
                                        {highlight}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
