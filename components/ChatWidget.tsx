'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatWidget.module.css';

// =============================================================================
// Types
// =============================================================================

interface Message {
    id: string;
    role: 'user' | 'bot' | 'error';
    content: string;
}

// =============================================================================
// Icons
// =============================================================================

const ChatIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

// =============================================================================
// Markdown Components (Custom styling)
// =============================================================================

const markdownComponents = {
    // Style code blocks
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
    // Style links
    a: ({ node, children, ...props }: any) => (
        <a
            className={styles.markdownLink}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        >
            {children}
        </a>
    ),
    // Style lists
    ul: ({ node, children, ...props }: any) => (
        <ul className={styles.markdownList} {...props}>
            {children}
        </ul>
    ),
    ol: ({ node, children, ...props }: any) => (
        <ol className={styles.markdownList} {...props}>
            {children}
        </ol>
    ),
    // Style blockquotes
    blockquote: ({ node, children, ...props }: any) => (
        <blockquote className={styles.markdownBlockquote} {...props}>
            {children}
        </blockquote>
    ),
};

// =============================================================================
// Component
// =============================================================================

const SUGGESTED_QUESTIONS = [
    "What are your skills?",
    "Tell me about your experience",
    "What projects have you worked on?",
];

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query.trim() }),
            });

            const data = await response.json();

            if (data.success && data.response) {
                const botMessage: Message = {
                    id: generateId(),
                    role: 'bot',
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

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit(inputValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(inputValue);
        }
    };

    const handleSuggestedClick = (question: string) => {
        handleSubmit(question);
    };

    return (
        <div className={styles.chatWidget}>
            {/* Chat Modal */}
            <div className={`${styles.chatModal} ${isOpen ? styles.visible : ''}`}>
                {/* Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.chatAvatar}>KS</div>
                    <div className={styles.chatHeaderInfo}>
                        <h3>Portfolio Assistant</h3>
                        <p>Ask me about Krishnapal&apos;s work</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className={styles.messagesArea}>
                    {messages.length === 0 ? (
                        <div className={styles.welcomeMessage}>
                            <h4>👋 Hi there!</h4>
                            <p>
                                I&apos;m an AI assistant that can answer questions about Krishnapal&apos;s
                                skills, experience, and projects. What would you like to know?
                            </p>
                            <div className={styles.suggestedQuestions}>
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        className={styles.suggestedBtn}
                                        onClick={() => handleSuggestedClick(q)}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.message} ${styles[msg.role]}`}
                            >
                                {msg.role === 'bot' ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className={`${styles.message} ${styles.bot}`}>
                            <div className={styles.loadingDots}>
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form className={styles.inputArea} onSubmit={handleFormSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        className={styles.sendButton}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>

            {/* Floating Button */}
            <button
                className={`${styles.chatButton} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
        </div>
    );
}
