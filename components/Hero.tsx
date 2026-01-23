'use client';

import { motion, Variants } from 'framer-motion';
import { FiDownload, FiArrowDown } from 'react-icons/fi';
import MagneticButton from './MagneticButton';
import styles from './Hero.module.css';

const titleVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
    },
};

const roles = ['Senior Flutter Developer', 'Mobile App Architect', 'Full-Stack Engineer'];

export default function Hero() {
    const name = 'Krishnapal Sendhav';

    return (
        <section id="home" className={styles.hero}>
            <div className={styles.content}>
                <motion.div
                    className={styles.badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <span className={styles.badgeDot} />
                    Available for opportunities
                </motion.div>

                <motion.h1
                    className={styles.title}
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {name.split('').map((letter, index) => (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            className={letter === ' ' ? styles.space : ''}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.h1>

                <motion.div
                    className={styles.roleWrapper}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <span className={styles.rolePrefix}>I&apos;m a</span>
                    <div className={styles.roleContainer}>
                        {roles.map((role, index) => (
                            <motion.span
                                key={role}
                                className={styles.role}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    y: [20, 0, 0, -20],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: index * 3,
                                    repeat: Infinity,
                                    repeatDelay: (roles.length - 1) * 3,
                                }}
                            >
                                {role}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                <motion.p
                    className={styles.description}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    Building innovative mobile experiences with Flutter, serving 50,000+ users.
                    Passionate about creating seamless, high-performance applications that make a difference.
                </motion.p>

                <motion.div
                    className={styles.buttons}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                >
                    <MagneticButton
                        as="a"
                        href="#contact"
                        className="btn-primary"
                        strength={0.4}
                    >
                        Get in Touch
                    </MagneticButton>
                    <MagneticButton
                        as="a"
                        href="/Krishnapal-Sendhav-Resume.pdf"
                        className="btn-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        strength={0.4}
                    >
                        <FiDownload />
                        Download CV
                    </MagneticButton>
                </motion.div>

                <motion.div
                    className={styles.stats}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                >
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>50K+</span>
                        <span className={styles.statLabel}>Users Served</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>2+</span>
                        <span className={styles.statLabel}>Years Experience</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>10+</span>
                        <span className={styles.statLabel}>Projects Delivered</span>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className={styles.scrollIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                    opacity: { delay: 2 },
                    y: { duration: 1.5, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }
                }}
            >
                <FiArrowDown />
                <span>Scroll to explore</span>
            </motion.div>
        </section>
    );
}
