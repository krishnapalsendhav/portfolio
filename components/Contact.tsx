'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiSend, FiMessageSquare, FiHeart } from 'react-icons/fi';
import styles from './Contact.module.css';

const contactInfo = [
    {
        icon: FiMail,
        label: 'Email',
        value: 'krishnapalsendhav591@gmail.com',
        href: 'mailto:krishnapalsendhav591@gmail.com',
    },
    {
        icon: FiPhone,
        label: 'Phone',
        value: '+91 8959562779',
        href: 'tel:+918959562779',
    },
    {
        icon: FiMapPin,
        label: 'Location',
        value: 'Indore, Madhya Pradesh, India',
        href: null,
    },
    {
        icon: FiLinkedin,
        label: 'LinkedIn',
        value: 'linkedin.com/in/krishnapal-sendhav',
        href: 'https://www.linkedin.com/in/krishnapal-sendhav/',
    },
];

// Floating message icons
const floatingMessages = ['💬', '📧', '✉️', '💌', '📨', '🚀'];

export default function Contact() {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        setFormData({ name: '', email: '', message: '' });
        alert('Thank you for your message! I will get back to you soon.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <section id="contact" ref={containerRef} className={`section ${styles.contact}`}>
            {/* Radiating Waves */}
            <div className={styles.waveContainer}>
                <motion.div
                    className={styles.wave}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className={styles.wave}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                <motion.div
                    className={styles.wave}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
            </div>

            {/* Floating Message Icons */}
            <div className={styles.floatingMessages}>
                {floatingMessages.map((icon, index) => (
                    <motion.span
                        key={index}
                        className={styles.floatingMessage}
                        style={{
                            left: `${10 + index * 15}%`,
                            top: `${20 + (index % 3) * 25}%`,
                            animationDelay: `${index * 0.8}s`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 0.5, scale: 1 } : {}}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                    >
                        {icon}
                    </motion.span>
                ))}
            </div>

            {/* Gradient Orbs */}
            <motion.div className={styles.gradientOrb1} style={{ y: y1 }} />
            <motion.div className={styles.gradientOrb2} style={{ scale }} />

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
                        The Destination
                    </motion.span>
                    <h2 className="section-title">Let&apos;s Connect</h2>
                    <p className="section-subtitle">
                        Ready to start your journey? Let&apos;s create something amazing together.
                    </p>
                </motion.div>

                <div className={styles.content}>
                    <motion.div
                        className={styles.contactInfo}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className={styles.infoTitle}>
                            <FiMessageSquare className={styles.titleIcon} />
                            Get In Touch
                        </h3>
                        <p className={styles.infoDescription}>
                            I&apos;m always open to discussing new projects, creative ideas, or
                            opportunities to be part of your vision.
                        </p>

                        <div className={styles.infoList}>
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={info.label}
                                    className={styles.infoItem}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                                >
                                    <motion.div
                                        className={styles.infoIcon}
                                        whileHover={{
                                            scale: 1.1,
                                            boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)'
                                        }}
                                    >
                                        <info.icon />
                                    </motion.div>
                                    <div className={styles.infoContent}>
                                        <span className={styles.infoLabel}>{info.label}</span>
                                        {info.href ? (
                                            <a
                                                href={info.href}
                                                className={styles.infoValue}
                                                target={info.href.startsWith('http') ? '_blank' : undefined}
                                                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            >
                                                {info.value}
                                            </a>
                                        ) : (
                                            <span className={styles.infoValue}>{info.value}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.form
                        className={`glass-card ${styles.form}`}
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {/* Form glow effect */}
                        <div className={styles.formGlow} />

                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.label}>Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className={styles.textarea}
                                placeholder="Tell me about your project..."
                                rows={5}
                                required
                            />
                        </div>

                        <motion.button
                            type="submit"
                            className={`btn-primary ${styles.submitBtn}`}
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 245, 255, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? (
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    ⏳
                                </motion.span>
                            ) : (
                                <>
                                    <FiSend />
                                    Send Message
                                </>
                            )}
                        </motion.button>
                    </motion.form>
                </div>
            </div>

            <footer className={styles.footer}>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                >
                    © {new Date().getFullYear()} Krishnapal Sendhav. Built with
                    <motion.span
                        className={styles.heart}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <FiHeart />
                    </motion.span>
                    using Next.js
                </motion.p>
            </footer>
        </section>
    );
}
