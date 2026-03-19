'use client';

import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
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
const PENDING_QUERY_KEY = 'chat_pending_query';
const MAX_STORED_MSG = 50;

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
        const trimmed = messages.slice(-MAX_STORED_MSG);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
        // Storage full — fail silently
    }
}

function clearChatHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch { }
}

// =============================================================================
// SessionStorage Helper — reads and immediately clears (consume-once pattern)
// =============================================================================

function consumePendingQuery(): string | null {
    try {
        const query = sessionStorage.getItem(PENDING_QUERY_KEY);
        if (query) sessionStorage.removeItem(PENDING_QUERY_KEY);
        return query;
    } catch {
        return null;
    }
}

// =============================================================================
// Chat Page
// — No useSearchParams, no Suspense wrapper needed
// — Fix 1: historyLoaded flag prevents race condition between localStorage + initial query
// — Fix 2: messagesRef always holds the latest messages (no stale closures)
// =============================================================================

export default function ChatPage() {
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [historyLoaded, setHistoryLoaded] = useState(false); // ✅ Fix 1

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const initializedRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const messagesRef = useRef<Message[]>([]); // ✅ Fix 2

    // -------------------------------------------------------------------------
    // Step 1: Load localStorage history → signal ready
    // -------------------------------------------------------------------------
    useEffect(() => {
        const history = loadChatHistory();
        if (history.length > 0) {
            setMessages(history);
            messagesRef.current = history; // ✅ sync ref immediately
        }
        setHistoryLoaded(true); // ✅ triggers Step 2 effect
    }, []);

    // -------------------------------------------------------------------------
    // Step 2: Fire pending query ONLY after history is committed
    // This guarantees handleSubmit sees correct messages in messagesRef
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (!historyLoaded || initializedRef.current) return;
        initializedRef.current = true;

        const pendingQuery = consumePendingQuery();
        if (pendingQuery) {
            handleSubmit(pendingQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historyLoaded]);

    // -------------------------------------------------------------------------
    // Auto-scroll on new messages or streaming updates
    // -------------------------------------------------------------------------
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingText]);

    // -------------------------------------------------------------------------
    // Re-focus input after response completes
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (!isLoading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    const generateId = () =>
        `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Wraps setMessages — keeps messagesRef in sync + persists to localStorage
    const updateMessages = (updater: (prev: Message[]) => Message[]) => {
        setMessages((prev) => {
            const next = updater(prev);
            messagesRef.current = next; // ✅ always fresh
            saveChatHistory(next);
            return next;
        });
    };

    // -------------------------------------------------------------------------
    // Clear chat
    // -------------------------------------------------------------------------
    const handleClearChat = () => {
        abortControllerRef.current?.abort();
        messagesRef.current = [];
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

        // ✅ Uses ref — never stale, captures correct history even on initial load
        const currentMessages = [...messagesRef.current];

        updateMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setStreamingText('');

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query.trim(),
                    messages: currentMessages, // ✅ correct history sent to API
                }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response');
            }

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
                            setStreamingText(fullText);
                        }
                    } catch {
                        // Skip malformed chunks
                    }
                }
            }

            const botMessage: Message = {
                id: generateId(),
                role: 'model',
                content: fullText || 'No response received.',
                timestamp: Date.now(),
            };

            updateMessages((prev) => [...prev, botMessage]);

        } catch (error: any) {
            if (error?.name === 'AbortError') return;

            console.error('Stream error:', error);
            updateMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: 'error',
                    content: 'Sorry, something went wrong. Please try again.',
                    timestamp: Date.now(),
                },
            ]);
        } finally {
            setIsLoading(false);
            setStreamingText('');
        }
    };

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
    // Render — no Suspense needed since useSearchParams is gone
    // -------------------------------------------------------------------------
    return (
        <LenisProvider>
            <main className={styles.main}>
                <CustomCursor />
                <div className="noise-overlay" />

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
                        {messages.length === 0 && !isLoading && (
                            <div className={styles.emptyState}>
                                <div className={styles.avatarLarge}>KS</div>
                                <h3>How can I help you?</h3>
                                {/* ✅ Suggested questions */}
                                <div className={styles.suggestions}>
                                    {[
                                        "What projects have you built?",
                                        "What tech stack do you work with?",
                                        "Are you open to new opportunities?",
                                    ].map((q) => (
                                        <button
                                            key={q}
                                            className={styles.suggestionChip}
                                            onClick={() => handleSubmit(q)}
                                            data-cursor
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


                        <div className={styles.messageList}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`${styles.messageWrapper} ${styles[msg.role]}`}
                                >
                                    <div className={styles.messageContent}>
                                        {msg.role === 'model' || msg.role === 'error' ? (
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={markdownComponents}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        ) : (
                                            <p className={styles.userText}>{msg.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Live streaming — shown while tokens arrive */}
                            {isLoading && streamingText && (
                                <div className={`${styles.messageWrapper} ${styles.model}`}>
                                    <div className={styles.messageContent}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={markdownComponents}
                                        >
                                            {streamingText}
                                        </ReactMarkdown>
                                        <span className={styles.streamingCursor} />
                                    </div>
                                </div>
                            )}

                            {/* Loading dots — waiting for first token */}
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
                                placeholder={messages.length > 0 ? "Ask a follow-up..." : "Ask about my experience, skills, or projects."}
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
            </main>
        </LenisProvider>
    );
}
