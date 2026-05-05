'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navigation.module.css';

const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
];

export default function Navigation() {
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Update active section based on scroll position
            const sections = navItems.map((item) => item.href.slice(1));

            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className={styles.container}>
                    <motion.a
                        href="#home"
                        className={styles.logo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className={styles.logoText}>KS</span>
                    </motion.a>

                    <div className={styles.navLinks}>
                        {navItems.map((item) => (
                            <motion.button
                                key={item.name}
                                className={`${styles.navLink} ${activeSection === item.href.slice(1) ? styles.active : ''
                                    }`}
                                onClick={() => handleNavClick(item.href)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.name}
                                {activeSection === item.href.slice(1) && (
                                    <motion.div
                                        className={styles.activeIndicator}
                                        layoutId="activeIndicator"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`} />
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navItems.map((item, index) => (
                            <motion.button
                                key={item.name}
                                className={styles.mobileNavLink}
                                onClick={() => handleNavClick(item.href)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {item.name}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
