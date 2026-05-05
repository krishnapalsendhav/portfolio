'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, MouseEvent } from 'react';
import {
    FiMail, FiPhone, FiLinkedin, FiGithub,
    FiMapPin, FiSend, FiArrowRight,
} from 'react-icons/fi';
import styles from './Contact.module.css';

const contactLinks = [
    {
        icon: FiMail,
        label: 'Email',
        value: 'krishnapalsendhav591@gmail.com',
        href: 'mailto:krishnapalsendhav591@gmail.com',
    },
    {
        icon: FiLinkedin,
        label: 'LinkedIn',
        value: 'linkedin.com/in/krishnapal-sendhav',
        href: 'https://www.linkedin.com/in/krishnapal-sendhav/',
    },
    {
        icon: FiGithub,
        label: 'GitHub',
        value: 'github.com/krishnapalsendhav',
        href: 'https://github.com/krishnapalsendhav',
    },
    {
        icon: FiPhone,
        label: 'Phone',
        value: '+91 89595 62779',
        href: 'tel:+918959562779',
    },
    {
        icon: FiMapPin,
        label: 'Location',
        value: 'Indore, Madhya Pradesh, India',
        href: null,
    },
];

const openTo = [
    'Flutter Developer roles (full-time / contract)',
    'Backend engineering projects',
    'AI product collaborations',
    'Startup advisory & technical consulting',
];

const ease = [0.4, 0, 0.2, 1] as const;

export default function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                throw new Error(data.error || 'Failed to send');
            }
        } catch (err: any) {
            setSubmitError(err.message || 'Could not send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleMouseMove = (e: MouseEvent<HTMLFormElement>) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    };

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 24 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay, ease },
    });

    return (
        <section id="contact" className={`section ${styles.contact}`}>
            <div className="container">
                {/* Availability status strip */}
                <div className={styles.availabilityStrip}>
                    <span className={styles.availabilityDot} />
                    <span className={styles.availabilityText}>Available for new opportunities — May 2026</span>
                </div>

                {/* Header */}
                <motion.div ref={ref} className={styles.header} {...fadeUp(0)}>
                    <span className="section-label">Contact</span>
                    <h2 className="section-title">Let's Build Something</h2>
                    <p className="section-subtitle">
                        Whether it's a product idea, a technical challenge, or a role that needs an engineer
                        who ships — I'd like to hear about it.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {/* Left — Info */}
                    <motion.div {...fadeUp(0.1)}>
                        {/* Open to */}
                        <div className={styles.openTo}>
                            <p className={styles.openToTitle}>Open to</p>
                            <div className={styles.openToList}>
                                {openTo.map((item) => (
                                    <div key={item} className={styles.openToItem}>{item}</div>
                                ))}
                            </div>
                        </div>

                        {/* Contact links */}
                        <div className={styles.contactLinks}>
                            {contactLinks.map((link, i) => {
                                const Inner = (
                                    <>
                                        <div className={styles.contactLinkIcon}>
                                            <link.icon size={14} />
                                        </div>
                                        <div className={styles.contactLinkText}>
                                            <span className={styles.contactLinkLabel}>{link.label}</span>
                                            <span className={styles.contactLinkValue}>{link.value}</span>
                                        </div>
                                    </>
                                );
                                return link.href ? (
                                    <motion.a
                                        key={link.label}
                                        href={link.href}
                                        className={styles.contactLink}
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.3, delay: 0.15 + i * 0.06, ease }}
                                    >
                                        {Inner}
                                    </motion.a>
                                ) : (
                                    <motion.div
                                        key={link.label}
                                        className={styles.contactLink}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.3, delay: 0.15 + i * 0.06, ease }}
                                    >
                                        {Inner}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Right — Form */}
                    <motion.form
                        className={styles.form}
                        onSubmit={handleSubmit}
                        onMouseMove={handleMouseMove}
                        name="contact"
                        {...fadeUp(0.2)}
                    >
                        <div className={styles.formGlow} />
                        <div className={styles.formContent}>
                            <input type="hidden" name="form-name" value="contact" />

                            {submitted ? (
                                <div className={styles.submitSuccess}>
                                    <span className={styles.submitSuccessIcon}>✓</span>
                                    <p className={styles.submitSuccessText}>
                                        Message sent. I&apos;ll be in touch soon.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="name" className={styles.label}>Name</label>
                                            <input
                                                type="text" id="name" name="name"
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
                                                type="email" id="email" name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={styles.input}
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="message" className={styles.label}>Message</label>
                                        <textarea
                                            id="message" name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={styles.textarea}
                                            placeholder="Tell me about your project or opportunity..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending…' : (
                                            <>
                                                <FiSend size={12} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                    {submitError && (
                                        <p className={styles.formError}>
                                            {submitError}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.form>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerCopy}>
                        © {new Date().getFullYear()} Krishnapal Sendhav. All rights reserved.
                    </p>
                    <div className={styles.footerLinks}>
                        <a href="https://github.com/krishnapalsendhav" className={styles.footerLink} target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href="https://www.linkedin.com/in/krishnapal-sendhav/" className={styles.footerLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="mailto:krishnapalsendhav591@gmail.com" className={styles.footerLink}>Email</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
