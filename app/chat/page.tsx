'use client';

import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, FormEvent, KeyboardEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiArrowLeft, FiArrowUp, FiTrash2 } from 'react-icons/fi';
import LenisProvider from '@/components/LenisProvider';
import styles from './page.module.css';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });

// =============================================================================
// Types
// =============================================================================

interface Message {
    id: string;
    role: 'user' | 'model' | 'error';
    content: string;
    timestamp: number;
}

// =============================================================================
// Constants
// =============================================================================

const STORAGE_KEY = 'krishnapal_chat_history';
const MAX_STORED_MSG = 50; // Keep last 50 messages in storage

// =============================================================================
// Markdown Components
// =============================================================================

const markdownComponents = {
    code: ({ node, inline, className, children, ...props }: any) =>
        inline ? (
            <code className={styles.inlineCode} {...props}>{children}</code>
        ) : (
            <code className={styles.codeBlock} {...props}>{children}</code>
        ),
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
        <blockquote className={styles.markdownBlockquote} {...props}>{children}</blockquote>
    ),
};

// =============================================================================
// LocalStorage Helpers
// =============================================================================

function loadChatHistory(): Message[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored) as Message[];
    } catch {
        return [];
    }
}

function saveChatHistory(messages: Message[]): void {
    try {
        // Keep only last MAX_STORED_MSG messages to avoid storage overflow
        const trimmed = messages.slice(-MAX_STORED_MSG);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
        // Storage might be full — fail silently
    }
}

function clearChatHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // fail silently
    }
}

// =============================================================================
// Main Chat Component
// =============================================================================

function ChatContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q');

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState(''); // ✅ Live streaming buffer

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const initializedRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null); // ✅ For cancelling stream

    // -------------------------------------------------------------------------
    // Load chat history from localStorage on mount
    // -------------------------------------------------------------------------
    useEffect(() => {
        const history = loadChatHistory();
        if (history.length > 0) {
            setMessages(history);
        }
    }, []);

    // -------------------------------------------------------------------------
    // Auto-scroll on new messages or streaming updates
    // -------------------------------------------------------------------------
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingText]);

    // -------------------------------------------------------------------------
    // Focus input after loading
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (initializedRef.current && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const updateMessages = (updater: (prev: Message[]) => Message[]) => {
        setMessages((prev) => {
            const next = updater(prev);
            saveChatHistory(next); // ✅ Persist on every update
            return next;
        });
    };

    // -------------------------------------------------------------------------
    // Clear chat
    // -------------------------------------------------------------------------
    const handleClearChat = () => {
        // Cancel any ongoing stream
        abortControllerRef.current?.abort();
        setMessages([]);
        setStreamingText('');
        setIsLoading(false);
        clearChatHistory();
    };

    // -------------------------------------------------------------------------
    // Streaming Submit
    // -------------------------------------------------------------------------
    const handleSubmit = async (query: string) => {
        if (!query.trim() || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: query.trim(),
            timestamp: Date.now(),
        };

        // Capture current messages before state update for API call
        const currentMessages = [...messages];

        updateMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setStreamingText(''); // Clear streaming buffer

        // Create abort controller for this request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            // ✅ Call streaming endpoint
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query.trim(),
                    messages: currentMessages, // Send history (without new user msg)
                }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response');
            }

            // ✅ Read SSE stream token by token
            const reader = response.body!.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const raw = decoder.decode(value, { stream: true });
                const lines = raw.split('\n').filter((l) => l.startsWith('data: '));

                for (const line of lines) {
                    const payload = line.replace('data: ', '').trim();
                    if (!payload || payload === '[DONE]') continue;

                    try {
                        const { token } = JSON.parse(payload);
                        if (token) {
                            fullText += token;
                            setStreamingText(fullText); // ✅ Show tokens live
                        }
                    } catch {
                        // Skip malformed chunks
                    }
                }
            }

            // ✅ Stream complete — commit full message to history
            const botMessage: Message = {
                id: generateId(),
                role: 'model',
                content: fullText || 'No response received.',
                timestamp: Date.now(),
            };

            updateMessages((prev) => [...prev, botMessage]);

        } catch (error: any) {
            if (error?.name === 'AbortError') return; // User cancelled — no error message

            console.error('Stream error:', error);
            const errorMessage: Message = {
                id: generateId(),
                role: 'error',
                content: 'Sorry, something went wrong. Please try again.',
                timestamp: Date.now(),
            };
            updateMessages((prev) => [...prev, errorMessage]);

        } finally {
            setIsLoading(false);
            setStreamingText(''); // ✅ Clear buffer after committing
        }
    };

    // -------------------------------------------------------------------------
    // Initial query from URL param
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (!initializedRef.current && initialQuery) {
            initializedRef.current = true;
            handleSubmit(initialQuery);
        } else if (!initializedRef.current) {
            initializedRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery]);

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

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    return (
        <div className={styles.chatContainer}>

            {/* Header */}
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
                {/* ✅ Clear chat button — only shown when there are messages */}
                {messages.length > 0 && (
                    <button
                        onClick={handleClearChat}
                        className={styles.clearButton}
                        aria-label="Clear chat history"
                        data-cursor
                        title="Clear chat"
                    >
                        <FiTrash2 size={18} />
                    </button>
                )}
            </header>

            {/* Messages */}
            <div className={styles.messagesArea} data-lenis-prevent>
                {messages.length === 0 && !isLoading && !initialQuery && (
                    <div className={styles.emptyState}>
                        <div className={styles.avatarLarge}>KS</div>
                        <h3>How can I help you?</h3>
                        <p>Ask me about my experience, skills, or projects.</p>
                    </div>
                )}

                <div className={styles.messageList}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
                            <div className={styles.messageContent}>
                                {msg.role === 'model' || msg.role === 'error' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p className={styles.userText}>{msg.content}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* ✅ Live streaming message — shown while tokens arrive */}
                    {isLoading && streamingText && (
                        <div className={`${styles.messageWrapper} ${styles.model}`}>
                            <div className={styles.messageContent}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                    {streamingText}
                                </ReactMarkdown>
                                <span className={styles.streamingCursor} /> {/* Blinking cursor */}
                            </div>
                        </div>
                    )}

                    {/* Loading dots — only shown while waiting for first token */}
                    {isLoading && !streamingText && (
                        <div className={`${styles.messageWrapper} ${styles.model}`}>
                            <div className={styles.messageContent}>
                                <div className={styles.loadingPulse}>
                                    <span /><span /><span />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
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

// =============================================================================
// Page Export
// =============================================================================

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
