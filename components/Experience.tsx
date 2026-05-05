'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
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
                    'Leading mobile architecture and development initiatives across Android, iOS, Windows, and macOS.',
                    'Mentoring junior developers and establishing engineering standards for production code quality.',
                    'Driving technical decisions and system design for scaling the platform to 100K+ users.',
                ],
            },
            {
                title: 'Flutter Developer',
                period: 'Apr 2023 – Jun 2025',
                description: [
                    'Built Student App and Management App from scratch — now serving 50,000+ active users.',
                    'Implemented custom DRM and encrypted content delivery for secure video consumption.',
                    'Developed real-time live class features: chat, polls, participant management, file sharing.',
                    'Created an innovative App Builder for dynamic layout customisation without releases.',
                    'Owned full-stack development: Flutter front-end, backend APIs, Firebase integration.',
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
                    'Delivered multiple client-facing mobile applications using Flutter and Firebase.',
                    'Collaborated with cross-functional teams across design, backend, and QA.',
                    'Gained production experience in the full mobile app development and release lifecycle.',
                ],
            },
        ],
    },
];

const ease = [0.4, 0, 0.2, 1] as const;

export default function Experience() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <section id="experience" className={`section ${styles.experience}`}>
            <div className="container">
                {/* Header */}
                <motion.div
                    ref={ref}
                    className={styles.header}
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, ease }}
                >
                    <span className="section-label">Experience</span>
                    <h2 className="section-title">The Journey</h2>
                    <p className="section-subtitle">
                        Three years building production software that ships, scales, and keeps improving.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className={styles.timeline}>
                    {experiences.map((exp, expIdx) => (
                        <motion.div
                            key={exp.company}
                            className={styles.timelineItem}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: expIdx * 0.15, ease }}
                        >
                            <div className={styles.timelineDot} />

                            <div className={styles.companyBlock} onMouseMove={handleMouseMove}>
                                <div className={styles.companyGlow} />
                                <div className={styles.companyContent}>
                                {/* Company Header */}
                                <div className={styles.companyHeader}>
                                    <h3 className={styles.companyName}>{exp.company}</h3>
                                    <div className={styles.companyMeta}>
                                        <span className={styles.companyLocation}>
                                            <FiMapPin size={10} />
                                            {exp.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Roles */}
                                <div className={styles.roles}>
                                    {exp.roles.map((role, rIdx) => (
                                        <div key={role.title} className={styles.role}>
                                            <div className={styles.roleHeader}>
                                                <h4 className={styles.roleTitle}>{role.title}</h4>
                                                <span className={styles.rolePeriod}>
                                                    <FiCalendar size={10} />
                                                    {role.period}
                                                </span>
                                            </div>

                                            <ul className={styles.roleDescription}>
                                                {role.description.map((item, i) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: expIdx * 0.15 + rIdx * 0.05 + i * 0.04,
                                                            ease,
                                                        }}
                                                    >
                                                        {item}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
