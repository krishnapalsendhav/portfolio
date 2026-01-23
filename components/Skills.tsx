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
        title: 'Core',
        icon: FiCode,
        skills: [
            { name: 'Flutter', icon: SiFlutter, level: 95 },
            { name: 'Dart', icon: SiDart, level: 95 },
            { name: 'Clean Architecture', icon: FiCode, level: 90 },
            { name: 'REST APIs', icon: FiServer, level: 90 },
            { name: 'WebSockets', icon: FiServer, level: 85 },
        ],
    },
    {
        title: 'State Management',
        icon: FiDatabase,
        skills: [
            { name: 'GetX (2+ yrs)', icon: SiFlutter, level: 95 },
        ],
    },
    {
        title: 'Real-Time & Media',
        icon: FiCpu,
        skills: [
            { name: 'Live Chat & Polls', icon: FiCpu, level: 90 },
            { name: 'Video Streaming', icon: FiCpu, level: 85 },
            { name: 'Custom DRM', icon: FiCpu, level: 85 },
            { name: 'File Sharing', icon: FiCpu, level: 85 },
        ],
    },
    {
        title: 'AI & Backend',
        icon: FiServer,
        skills: [
            { name: 'On-device AI', icon: SiOpenai, level: 85 },
            { name: 'Firebase', icon: SiFirebase, level: 90 },
            { name: 'AI Pipelines', icon: SiOpenai, level: 80 },
            { name: 'LLM Integration', icon: SiOpenai, level: 80 },
        ],
    },
    {
        title: 'Tools',
        icon: FiDatabase,
        skills: [
            { name: 'Git', icon: SiGit, level: 90 },
            { name: 'CI/CD', icon: SiDocker, level: 75 },
            { name: 'Figma → Flutter', icon: SiFlutter, level: 85 },
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
                    <h2 className="section-title">Skills & Technologies</h2>
                    <p className="section-subtitle">
                        The futuristic stack empowering my creations
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
                                <category.icon className={styles.categoryIcon} />
                                <h3 className={styles.categoryTitle}>{category.title}</h3>
                            </div>

                            <div className={styles.skillsGrid}>
                                {category.skills.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skill.name}
                                        className={styles.skillBadge}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{
                                            duration: 0.4,
                                            delay: catIndex * 0.1 + skillIndex * 0.05
                                        }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                    >
                                        <skill.icon className={styles.skillIcon} />
                                        <span className={styles.skillName}>{skill.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
