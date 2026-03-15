'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowUp, FiPaperclip } from 'react-icons/fi';
import styles from './LandingAiBox.module.css';

export default function LandingAiBox() {
    const [inputValue, setInputValue] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        if (!inputValue.trim()) return;

        // Navigate to the full chat page with the query as a URL parameter
        router.push(`/chat?q=${encodeURIComponent(inputValue.trim())}`);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const [placeholder, setPlaceholder] = useState("Ask about my skills, projects, or experience...");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setPlaceholder("Ask me something...");
            } else {
                setPlaceholder("Ask about my skills, projects, or experience...");
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>

                <textarea
                    className={styles.input}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                />
                <button
                    onClick={handleSubmit}
                    className={`${styles.sendButton} ${inputValue.trim() ? styles.active : ''}`}
                    disabled={!inputValue.trim()}
                    aria-label="Send message"
                    type="button"
                >
                    <FiArrowUp size={20} />
                </button>
            </div>
            <p className={styles.hint}>
                Press Enter to send. Powered by AI to answer your questions.
            </p>
        </div>
    );
}
