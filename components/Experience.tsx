'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import styles from './Experience.module.css';

const experiences = [
    {
        company: 'ClassIO',
        location: 'Indore, India',
        roles: [
            {
                title: 'Senior Software Engineer',
                period: 'Jun 2025 – Present',
                description: [
                    'Leading mobile app architecture and development initiatives',
                    'Mentoring junior developers and conducting code reviews',
                    'Driving technical decisions for scaling to 100K+ users',
                ],
            },
            {
                title: 'Flutter Developer',
                period: 'Apr 2023 – Jun 2025',
                description: [
                    'Built Student App and Management App from scratch, serving 50,000+ users',
                    'Implemented custom DRM and content consumption modules',
                    'Developed real-time live class features with chat, polls, and file sharing',
                    'Created innovative App Builder for dynamic layout customization',
                    'Handled end-to-end frontend and backend development',
                ],
            },
        ],
    },
    {
        company: 'Rainbow IT Solution',
        location: 'Ujjain, India (Remote)',
        roles: [
            {
                title: 'Flutter Developer',
                period: 'Aug 2022 – Mar 2023',
                description: [
                    'Developed multiple mobile applications using Flutter framework',
                    'Collaborated with cross-functional teams to deliver projects on time',
                    'Gained foundational experience in mobile app development lifecycle',
                ],
            },
        ],
    },
];

// Floating geometric shapes for background
const floatingShapes = [
    { type: 'circle', size: 8, delay: 0 },
    { type: 'square', size: 6, delay: 1 },
    { type: 'triangle', size: 10, delay: 2 },
    { type: 'circle', size: 5, delay: 3 },
    { type: 'square', size: 7, delay: 4 },
];

export default function Experience() {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
    const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);

    return (
        <section id="experience" ref={containerRef} className={`section ${styles.experience}`}>
            {/* Floating Shapes */}
            <div className={styles.floatingShapes}>
                {floatingShapes.map((shape, index) => (
                    <motion.div
                        key={index}
                        className={`${styles.floatingShape} ${styles[shape.type]}`}
                        style={{
                            width: shape.size * 5,
                            height: shape.size * 5,
                            left: `${15 + index * 18}%`,
                            top: `${20 + (index % 3) * 25}%`,
                            animationDelay: `${shape.delay}s`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
                        transition={{ delay: shape.delay * 0.2, duration: 0.6 }}
                    />
                ))}
            </div>

            {/* Gradient Orb */}
            <motion.div className={styles.gradientOrb} style={{ y: y1 }} />
            <motion.div className={styles.gradientOrb2} style={{ y: y2 }} />

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
                        Chapter 02
                    </motion.span>
                    <h2 className="section-title">The Journey</h2>
                    <p className="section-subtitle">
                        My professional path through the world of software development
                    </p>
                </motion.div>

                <div className={styles.timeline}>
                    {/* Animated Path Line */}
                    <svg className={styles.pathSvg} viewBox="0 0 4 800" preserveAspectRatio="none">
                        <motion.path
                            d="M 2 0 L 2 800"
                            stroke="url(#pathGradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            style={{ pathLength }}
                        />
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#00f5ff" />
                                <stop offset="50%" stopColor="#bf00ff" />
                                <stop offset="100%" stopColor="#4d7cff" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Traveling Dot */}
                    <motion.div
                        className={styles.travelingDot}
                        style={{
                            top: useTransform(scrollYProgress, [0, 1], ['0%', '90%'])
                        }}
                    />

                    {experiences.map((exp, expIndex) => (
                        <motion.div
                            key={exp.company}
                            className={styles.timelineItem}
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: expIndex * 0.2 }}
                        >
                            <div className={styles.timelineMarker}>
                                <motion.div
                                    className={styles.markerDot}
                                    animate={{
                                        boxShadow: [
                                            '0 0 20px rgba(0, 245, 255, 0.5)',
                                            '0 0 40px rgba(0, 245, 255, 0.8)',
                                            '0 0 20px rgba(0, 245, 255, 0.5)'
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <div className={styles.markerLine} />
                            </div>

                            <motion.div
                                className={`glass-card ${styles.companyCard}`}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: '0 0 60px rgba(0, 245, 255, 0.2)'
                                }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className={styles.companyHeader}>
                                    <div className={styles.companyInfo}>
                                        <h3 className={styles.companyName}>
                                            <FiBriefcase className={styles.icon} />
                                            {exp.company}
                                        </h3>
                                        <span className={styles.companyLocation}>
                                            <FiMapPin className={styles.icon} />
                                            {exp.location}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.roles}>
                                    {exp.roles.map((role, roleIndex) => (
                                        <div key={role.title} className={styles.role}>
                                            <div className={styles.roleHeader}>
                                                <h4 className={styles.roleTitle}>{role.title}</h4>
                                                <span className={styles.rolePeriod}>
                                                    <FiCalendar className={styles.icon} />
                                                    {role.period}
                                                </span>
                                            </div>
                                            <ul className={styles.roleDescription}>
                                                {role.description.map((item, i) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                                        transition={{
                                                            duration: 0.4,
                                                            delay: expIndex * 0.2 + roleIndex * 0.1 + i * 0.05
                                                        }}
                                                    >
                                                        {item}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
