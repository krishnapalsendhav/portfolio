'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';
import styles from './NavigationNew.module.css';

const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
];

export default function NavigationNew() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        setTimeout(() => {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    const handleChatClick = () => {
        try {
            const stored = localStorage.getItem('krishnapal_chat_history');
            const hasHistory = stored && JSON.parse(stored).length > 0;

            if (!hasHistory) {
                sessionStorage.setItem(
                    'chat_pending_query',
                    'Tell me your Experience, skills and projects'
                );
            }
        } catch {
            // storage unavailable — navigate anyway
        }

        router.push('/chat');
    };


    return (
        <>
            {/* Header */}
            <motion.header
                className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className={styles.container}>
                    <motion.a
                        href="#home"
                        className={styles.logo}
                        data-cursor
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className={styles.logoText}>KS</span>
                        <span className={styles.logoDot} />
                    </motion.a>

                    <div className={styles.headerActions}>

                        {/* ✅ Chat button — before menu icon */}
                        <motion.button
                            className={styles.chatButton}
                            onClick={handleChatClick}
                            data-cursor
                            data-cursor-text="Chat"
                            aria-label="Open AI chat"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiMessageSquare size={16} />
                            <span>Ask AI</span>
                        </motion.button>

                        {/* Menu button */}
                        <button
                            className={`${styles.menuButton} ${isOpen ? styles.open : ''}`}
                            onClick={() => setIsOpen(!isOpen)}
                            data-cursor
                            data-cursor-text={isOpen ? 'Close' : 'Menu'}
                            aria-label="Toggle menu"
                        >
                            <span className={styles.menuLine} />
                            <span className={styles.menuLine} />
                        </button>

                    </div>
                </div>
            </motion.header>

            {/* Full-screen overlay menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className={styles.overlayBg}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        />

                        <nav className={styles.nav}>
                            <ul className={styles.navList}>
                                {navItems.map((item, index) => (
                                    <motion.li
                                        key={item.name}
                                        className={styles.navItem}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.4, delay: index * 0.08 }}
                                    >
                                        <button
                                            className={styles.navLink}
                                            onClick={() => handleNavClick(item.href)}
                                            data-cursor
                                        >
                                            <span className={styles.navNumber}>0{index + 1}</span>
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
                            <a href="mailto:krishnapalsendhav591@gmail.com" data-cursor>
                                krishnapalsendhav591@gmail.com
                            </a>
                            <a href="https://linkedin.com/in/krishnapal-sendhav" target="_blank" rel="noopener noreferrer" data-cursor>
                                LinkedIn
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
