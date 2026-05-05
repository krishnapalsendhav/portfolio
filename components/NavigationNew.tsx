'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';
import styles from './NavigationNew.module.css';

const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
];

const ease = [0.4, 0, 0.2, 1] as const;

export default function NavigationNew() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            // Update scrolled state for styling
            setIsScrolled(window.scrollY > 50);

            // Detect active section based on scroll position
            const sectionIds = navItems.map(item => item.href.slice(1));
            const scrollPos = window.scrollY + 200; // 200px buffer from top

            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const id = sectionIds[i];
                const el = document.getElementById(id);
                if (el) {
                    const { offsetTop } = el;
                    if (scrollPos >= offsetTop) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        setTimeout(() => {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    const handleChatClick = () => {
        try {
            const stored = localStorage.getItem('krishnapal_chat_history');
            if (!stored || JSON.parse(stored).length === 0) {
                sessionStorage.setItem('chat_pending_query', 'Tell me your experience, skills and projects');
            }
        } catch { /* storage unavailable */ }
        router.push('/chat');
    };

    return (
        <>
            {/* Header */}
            <motion.header
                className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease }}
            >
                <div className={styles.container}>
                    {/* Logo */}
                    <motion.a
                        href="#home"
                        className={styles.logo}
                        whileHover={{ opacity: 0.8 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => { e.preventDefault(); document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }); }}
                    >
                        <div className={styles.logoMark}>
                            <span className={styles.logoText}>KS</span>
                        </div>
                        <span className={styles.logoLabel}>Krishnapal Sendhav</span>
                    </motion.a>

                    {/* Desktop nav links */}
                    <nav className={styles.desktopNav} aria-label="Main navigation">
                        <ul className={styles.desktopNavList}>
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <button
                                        className={`${styles.desktopNavLink} ${activeSection === item.href.slice(1) ? styles.desktopNavActive : ''}`}
                                        onClick={() => handleNavClick(item.href)}
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.headerActions}>
                        {/* Current section indicator — mobile only */}
                        <span className={styles.sectionIndicator}>
                            {navItems.find(i => i.href.slice(1) === activeSection)?.name ?? ''}
                        </span>

                        {/* Ask AI */}
                        <motion.button
                            className={styles.chatButton}
                            onClick={handleChatClick}
                            aria-label="Open AI chat"
                            whileTap={{ scale: 0.97 }}
                        >
                            <FiMessageSquare size={12} />
                            <span>Ask AI</span>
                        </motion.button>

                        {/* Hamburger */}
                        <button
                            className={`${styles.menuButton} ${isOpen ? styles.open : ''}`}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isOpen}
                        >
                            <span className={styles.menuLine} />
                            <span className={styles.menuLine} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Fullscreen overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <motion.div
                            className={styles.overlayBg}
                            initial={{ clipPath: 'inset(0 0 100% 0)' }}
                            animate={{ clipPath: 'inset(0 0 0% 0)' }}
                            exit={{ clipPath: 'inset(0 0 100% 0)' }}
                            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        />

                        <nav className={styles.nav} aria-label="Main navigation">
                            <ul className={styles.navList}>
                                {navItems.map((item, i) => (
                                    <motion.li
                                        key={item.name}
                                        className={styles.navItem}
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 40 }}
                                        transition={{ duration: 0.4, delay: i * 0.06, ease }}
                                    >
                                        <button
                                            className={`${styles.navLink} ${activeSection === item.href.slice(1) ? styles.active : ''}`}
                                            onClick={() => handleNavClick(item.href)}
                                        >
                                            <span className={styles.navNumber}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className={styles.navText}>{item.name}</span>
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>

                        <motion.div
                            className={styles.overlayFooter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <a href="mailto:krishnapalsendhav591@gmail.com">
                                krishnapalsendhav591@gmail.com
                            </a>
                            <a href="https://linkedin.com/in/krishnapal-sendhav" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
