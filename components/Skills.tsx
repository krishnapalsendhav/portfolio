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
        title: 'Frontend & Mobile',
        icon: FiCode,
        skills: [
            { name: 'Flutter', icon: SiFlutter, level: 95 },
            { name: 'Dart', icon: SiDart, level: 95 },
            { name: 'JavaScript', icon: SiJavascript, level: 85 },
            { name: 'Java', icon: SiTypescript, level: 80 },
        ],
    },
    {
        title: 'AI & Machine Learning',
        icon: FiCpu,
        skills: [
            { name: 'On-Device AI', icon: SiOpenai, level: 85 },
            { name: 'LLM Integration', icon: SiOpenai, level: 80 },
            { name: 'AI Agents', icon: SiOpenai, level: 75 },
        ],
    },
    {
        title: 'Backend',
        icon: FiServer,
        skills: [
            { name: 'Node.js', icon: SiNodedotjs, level: 85 },
            { name: 'Firebase', icon: SiFirebase, level: 90 },
            { name: 'PostgreSQL', icon: SiPostgresql, level: 75 },
        ],
    },
    {
        title: 'Tools & DevOps',
        icon: FiDatabase,
        skills: [
            { name: 'Git', icon: SiGit, level: 90 },
            { name: 'MongoDB', icon: SiMongodb, level: 80 },
            { name: 'Docker', icon: SiDocker, level: 70 },
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
