'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    SiFlutter,
    SiDart,
    SiJavascript,
    SiTypescript,
    SiNodedotjs,
    SiFirebase,
    SiGit,
    SiMongodb,
    SiPostgresql,
    SiDocker,
    SiOpenai
} from 'react-icons/si';
import { FiCode, FiServer, FiDatabase, FiCpu } from 'react-icons/fi';
import styles from './Skills.module.css';

const skillCategories = [
    {
        title: 'Primary Expertise',
        description: 'Core focus on high-scale production systems',
        icon: FiCode,
        items: [
            'Flutter (production apps at 50K+ scale)',
            'Dart (performance-focused UI & state handling)',
            'Mobile system architecture & modular design',
            'Full-stack mobile product ownership'
        ],
    },
    {
        title: 'Architecture & System Design',
        description: 'Engineering judgment and scalability',
        icon: FiCpu,
        items: [
            'Clean Architecture for long-term maintainability',
            'Modular / feature-based design patterns',
            'State management strategy at enterprise scale',
            'Architected systems for high-concurrency mobile workloads',
            'Security protocols & Custom DRM integration'
        ],
    },
    {
        title: 'Backend & Data Systems',
        description: 'Cloud infrastructure and real-time connectivity',
        icon: FiServer,
        items: [
            'Production backend APIs for engagement-driven platforms',
            'Real-time interaction infrastructure (Firebase Realtime Database)',
            'Live session state and participant management systems',
            'AI-driven conversational backend systems',
            "Event-driven notification infrastructure"
        ],
    },
    {
        title: 'Applied AI Engineering',
        description: 'Production-ready AI integration',
        icon: SiOpenai,
        items: [
            'On-device AI for low-latency mobile features',
            'LLM orchestration in production apps',
            'Agentic workflows for automated learning & content systems',
            'AI pipelines for automated media processing',
            'LangChain-based RAG implementations'
        ],
    },
    {
        title: 'Programming Languages',
        description: 'Applied proficiency across the stack',
        icon: FiCode,
        items: [
            'Dart (Primary: Core production development)',
            'TypeScript (Applied: Backend & Developer tooling)',
            'JavaScript (Applied: Integration & Web features)',
            'Python (Applied: AI automation & Pipelines)'
        ],
    },
    {
        title: 'Engineering Workflow & Delivery',
        description: 'Release management and lead ownership',
        icon: FiDatabase,
        items: [
            'End-to-end App Store & Play Store delivery',
            'Release coordination aligned with product milestones',
            'Release governance and crash management',
            'Post-release iteration based on user behavior and feedback',
            'Cross-functional team collaboration & Git flows'
        ],
    },
];

import NeuralBackground from './NeuralBackground';

export default function Skills() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="skills" className={`section ${styles.skills}`}>
            <NeuralBackground />
            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Senior Engineering & Architecture</h2>
                    <p className="section-subtitle">
                        Building production-grade systems with focus on scale, performance, and maintainability.
                    </p>
                </motion.div>

                <div className={styles.categories}>
                    {skillCategories.map((category, catIndex) => (
                        <motion.div
                            key={category.title}
                            className={`glass-card ${styles.category}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                        >
                            <div className={styles.categoryHeader}>
                                <div className={styles.iconWrapper}>
                                    <category.icon className={styles.categoryIcon} />
                                </div>
                                <div className={styles.headerText}>
                                    <h3 className={styles.categoryTitle}>{category.title}</h3>
                                    <p className={styles.categoryDescription}>{category.description}</p>
                                </div>
                            </div>

                            <ul className={styles.skillList}>
                                {category.items.map((item, itemIndex) => (
                                    <motion.li
                                        key={itemIndex}
                                        className={styles.skillItem}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{
                                            duration: 0.4,
                                            delay: catIndex * 0.1 + itemIndex * 0.05
                                        }}
                                    >
                                        <span className={styles.bullet}></span>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
