'use client';

import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, FormEvent, KeyboardEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiArrowLeft, FiArrowUp } from 'react-icons/fi';
import LenisProvider from '@/components/LenisProvider';
import styles from './page.module.css';

// Dynamic import for custom cursor to avoid SSR issues
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
    ssr: false,
});

interface Message {
    id: string;
    role: 'user' | 'model' | 'error';
    content: string;
}

const markdownComponents = {
    code: ({ node, inline, className, children, ...props }: any) => {
        return inline ? (
            <code className={styles.inlineCode} {...props}>
                {children}
            </code>
        ) : (
            <code className={styles.codeBlock} {...props}>
                {children}
            </code>
        );
    },
    a: ({ node, children, ...props }: any) => (
        <a className={styles.markdownLink} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    ),
    ul: ({ node, children, ...props }: any) => (
        <ul className={styles.markdownList} {...props}>{children}</ul>
    ),
    ol: ({ node, children, ...props }: any) => (
        <ol className={styles.markdownList} {...props}>{children}</ol>
    ),
    blockquote: ({ node, children, ...props }: any) => (
        <blockquote className={styles.markdownBlockquote} {...props}>
            {children}
        </blockquote>
    ),
};

interface TypewriterProps {
    text: string;
    onComplete?: () => void;
}

function Typewriter({ text, onComplete }: TypewriterProps) {
    const allLines = useRef(text.split('\n'));
    const [lineCount, setLineCount] = useState(0);

    useEffect(() => {
        if (lineCount >= allLines.current.length) {
            onComplete?.();
            return;
        }

        const timer = setTimeout(() => {
            setLineCount((prev) => prev + 1);
        }, 40); // Fast line-by-line reveal

        return () => clearTimeout(timer);
    }, [lineCount, onComplete]);

    const displayedText = allLines.current.slice(0, lineCount).join('\n');

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {displayedText}
        </ReactMarkdown>
    );
}

function ChatContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q');

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const handleSubmit = async (query: string) => {
        if (!query.trim() || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: query.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query.trim(),
                    messages: messages, // Send the current messages state
                }),
            });

            const data = await response.json();

            if (data.success && data.response) {
                const botMessage: Message = {
                    id: generateId(),
                    role: 'model',
                    content: data.response,
                };
                setMessages((prev) => [...prev, botMessage]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: generateId(),
                role: 'error',
                content: 'Sorry, something went wrong. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!initializedRef.current && initialQuery) {
            initializedRef.current = true;
            handleSubmit(initialQuery);
        } else if (!initializedRef.current) {
            initializedRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery]);

    useEffect(() => {
        if (initializedRef.current && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit(inputValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(inputValue);
        }
    };

    return (
        <div className={styles.chatContainer}>
            <header className={styles.header}>
                <button
                    onClick={() => router.push('/')}
                    className={styles.backButton}
                    aria-label="Back to home"
                    data-cursor
                >
                    <FiArrowLeft size={24} />
                </button>
                <div className={styles.headerTitle}>
                    <h2>Krishnapal Sendhav</h2>
                </div>
            </header>

            <div className={styles.messagesArea} data-lenis-prevent>
                {messages.length === 0 && !isLoading && !initialQuery && (
                    <div className={styles.emptyState}>
                        <div className={styles.avatarLarge}>KS</div>
                        <h3>How can I help you?</h3>
                        <p>Ask me about my experience, skills, or projects.</p>
                    </div>
                )}
                <div className={styles.messageList}>
                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
                            <div className={styles.messageContent}>
                                {msg.role === 'model' ? (
                                    index === messages.length - 1 && !isLoading ? (
                                        <Typewriter text={msg.content} />
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    )
                                ) : (
                                    <p className={styles.userText}>{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className={`${styles.messageWrapper} ${styles.model}`}>
                            <div className={styles.messageContent}>
                                <div className={styles.loadingPulse}>
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className={styles.inputArea}>
                <div className={styles.inputContainer}>
                    <textarea
                        ref={inputRef}
                        className={styles.textarea}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className={`${styles.sendButton} ${inputValue.trim() ? styles.active : ''}`}
                        onClick={handleFormSubmit}
                        disabled={!inputValue.trim() || isLoading}
                        aria-label="Send message"
                        data-cursor
                    >
                        <FiArrowUp size={20} />
                    </button>
                </div>
                <div className={styles.branding}>
                    AI Assistant for Krishnapal Sendhav
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <LenisProvider>
            <main className={styles.main}>
                <CustomCursor />
                <div className="noise-overlay" />
                <Suspense fallback={<div className={styles.loadingWrapper}>Loading chat...</div>}>
                    <ChatContent />
                </Suspense>
            </main>
        </LenisProvider>
    );
}
