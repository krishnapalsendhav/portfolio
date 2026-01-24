'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import styles from './SkillsSpatial.module.css';

interface SkillNode {
    id: string;
    label: string;
    category: 'primary' | 'architecture' | 'backend' | 'ai' | 'languages' | 'workflow';
    x: number;
    y: number;
    description: string;
}

interface SkillConnection {
    from: string;
    to: string;
}

// Move static data outside component to prevent recreation
const skillNodes: SkillNode[] = [
    // Primary Expertise (center-left)
    { id: 'flutter', label: 'Flutter', category: 'primary', x: 25, y: 35, description: 'Production apps at 50K+ scale' },
    { id: 'dart', label: 'Dart', category: 'primary', x: 18, y: 50, description: 'Performance-focused UI & state' },
    { id: 'mobile', label: 'Mobile Architecture', category: 'primary', x: 30, y: 55, description: 'Modular system design' },

    // Architecture (top-center)
    { id: 'clean-arch', label: 'Clean Architecture', category: 'architecture', x: 45, y: 20, description: 'Long-term maintainability' },
    { id: 'state-mgmt', label: 'State Management', category: 'architecture', x: 55, y: 28, description: 'Enterprise-scale patterns' },
    { id: 'security', label: 'Security & DRM', category: 'architecture', x: 38, y: 32, description: 'Custom content protection' },

    // Backend (right side)
    { id: 'firebase', label: 'Firebase', category: 'backend', x: 72, y: 40, description: 'Real-time infrastructure' },
    { id: 'websockets', label: 'WebSockets', category: 'backend', x: 80, y: 52, description: 'Live session management' },
    { id: 'rest-api', label: 'REST APIs', category: 'backend', x: 75, y: 65, description: 'Production backend systems' },

    // AI (bottom-right)
    { id: 'llm', label: 'LLM & Agents', category: 'ai', x: 65, y: 75, description: 'Agentic AI systems' },
    { id: 'on-device', label: 'On-Device AI', category: 'ai', x: 55, y: 82, description: 'Low-latency mobile features' },
    { id: 'langchain', label: 'LangChain/RAG', category: 'ai', x: 45, y: 78, description: 'AI pipeline orchestration' },

    // Languages (bottom-left)
    { id: 'javascript', label: 'JavaScript', category: 'languages', x: 22, y: 72, description: 'Web integrations' },
    { id: 'python', label: 'Python', category: 'languages', x: 32, y: 80, description: 'AI automation & pipelines' },
    { id: 'java', label: 'Java', category: 'languages', x: 15, y: 65, description: 'Backend & tooling' },

    // Workflow (center)
    { id: 'git', label: 'Git & CI/CD', category: 'workflow', x: 50, y: 50, description: 'Release management' },
    { id: 'stores', label: 'App Stores', category: 'workflow', x: 42, y: 60, description: 'End-to-end delivery' },
];

const connections: SkillConnection[] = [
    // Flutter ecosystem
    { from: 'flutter', to: 'dart' },
    { from: 'flutter', to: 'mobile' },
    { from: 'flutter', to: 'state-mgmt' },
    { from: 'mobile', to: 'clean-arch' },
    { from: 'mobile', to: 'security' },

    // Architecture to backend
    { from: 'clean-arch', to: 'state-mgmt' },
    { from: 'state-mgmt', to: 'firebase' },
    { from: 'firebase', to: 'websockets' },
    { from: 'websockets', to: 'rest-api' },

    // Backend to AI
    { from: 'rest-api', to: 'llm' },
    { from: 'llm', to: 'on-device' },
    { from: 'on-device', to: 'langchain' },
    { from: 'langchain', to: 'python' },

    // Languages connections
    { from: 'dart', to: 'java' },
    { from: 'java', to: 'javascript' },
    { from: 'javascript', to: 'python' },

    // Workflow hub
    { from: 'git', to: 'flutter' },
    { from: 'git', to: 'stores' },
    { from: 'stores', to: 'mobile' },
    { from: 'git', to: 'firebase' },
    { from: 'git', to: 'langchain' },
];

const categoryColors: Record<string, { main: string; glow: string }> = {
    primary: { main: '#00f5ff', glow: 'rgba(0, 245, 255, 0.4)' },
    architecture: { main: '#bf00ff', glow: 'rgba(191, 0, 255, 0.4)' },
    backend: { main: '#4d7cff', glow: 'rgba(77, 124, 255, 0.4)' },
    ai: { main: '#ff00a8', glow: 'rgba(255, 0, 168, 0.4)' },
    languages: { main: '#00ff9f', glow: 'rgba(0, 255, 159, 0.4)' },
    workflow: { main: '#ffaa00', glow: 'rgba(255, 170, 0, 0.4)' },
};

interface NodeProps {
    node: SkillNode;
    nodeIndex: number;
    isHovered: boolean;
    onHover: (id: string | null) => void;
    prefersReducedMotion: boolean;
}

// Memoize SkillNode component
const SkillNodeComponent = ({ node, nodeIndex, isHovered, onHover, prefersReducedMotion }: NodeProps) => {
    const colors = categoryColors[node.category];
    const animationDelay = prefersReducedMotion ? 0 : (nodeIndex * 0.05) % 0.3;
    const pulseDelay = prefersReducedMotion ? 0 : (nodeIndex * 0.2) % 2;

    // Memoize handlers
    const handleMouseEnter = useCallback(() => onHover(node.id), [node.id, onHover]);
    const handleMouseLeave = useCallback(() => onHover(null), [onHover]);

    return (
        <motion.div
            className={styles.skillNode}
            data-category={node.category}
            style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                borderColor: colors.main,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: isHovered ? 1.15 : 1,
                opacity: 1,
            }}
            transition={
                prefersReducedMotion
                    ? { duration: 0.3, opacity: { duration: 0.3 } }
                    : {
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                          delay: animationDelay,
                          opacity: { duration: 0.5, delay: animationDelay },
                      }
            }
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : {
                          scale: 1.15,
                      }
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label={`${node.label}: ${node.description}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMouseEnter();
                }
            }}
            onBlur={handleMouseLeave}
        >
            {/* Shadow element for glow effect */}
            <div
                className={styles.nodeGlow}
                style={{
                    boxShadow: isHovered
                        ? `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}`
                        : `0 0 15px ${colors.glow}`,
                }}
            />

            <span
                className={styles.nodeLabel}
                style={{ color: isHovered ? colors.main : 'rgba(255,255,255,0.9)' }}
                aria-hidden="true"
            >
                {node.label}
            </span>

            {/* Tooltip */}
            {isHovered && (
                <motion.div
                    className={styles.tooltip}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    role="tooltip"
                >
                    {node.description}
                </motion.div>
            )}

            {/* Pulse ring */}
            {!prefersReducedMotion && (
                <motion.div
                    className={styles.pulseRing}
                    style={{ borderColor: colors.main }}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: pulseDelay,
                        ease: 'easeInOut',
                    }}
                />
            )}
        </motion.div>
    );
};

// Memoize ConnectionLines component
const ConnectionLines = ({
    connections,
    dimensions,
    hoveredNode,
    prefersReducedMotion,
}: {
    connections: SkillConnection[];
    dimensions: { width: number; height: number };
    hoveredNode: string | null;
    prefersReducedMotion: boolean;
}) => {
    const getNodePosition = useCallback(
        (id: string) => {
            const node = skillNodes.find((n) => n.id === id);
            if (!node || dimensions.width === 0) return null;
            return {
                x: (node.x / 100) * dimensions.width,
                y: (node.y / 100) * dimensions.height,
            };
        },
        [dimensions]
    );

    return (
        <svg className={styles.connectionsSvg} aria-hidden="true">
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 245, 255, 0.3)" />
                    <stop offset="50%" stopColor="rgba(191, 0, 255, 0.3)" />
                    <stop offset="100%" stopColor="rgba(0, 245, 255, 0.3)" />
                </linearGradient>
            </defs>
            {connections.map((conn, index) => {
                const from = getNodePosition(conn.from);
                const to = getNodePosition(conn.to);
                if (!from || !to) return null;

                const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;

                return (
                    <motion.line
                        key={`${conn.from}-${conn.to}`}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={isHighlighted ? 'rgba(0, 245, 255, 0.6)' : 'url(#lineGradient)'}
                        strokeWidth={isHighlighted ? 2 : 1}
                        initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: isHighlighted ? 1 : 0.4,
                        }}
                        transition={
                            prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                      duration: 0.8,
                                      delay: index * 0.03,
                                      opacity: { duration: 0.2 },
                                  }
                        }
                    />
                );
            })}
        </svg>
    );
};

export default function SkillsSpatial() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();

        // Use ResizeObserver for better performance than resize event
        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Debug: Log nodes on mount
    useEffect(() => {
        console.log(`Rendering ${skillNodes.length} skill nodes`);
        skillNodes.forEach((node) => {
            console.log(`Node: ${node.id}, Category: ${node.category}, Position: (${node.x}%, ${node.y}%)`);
        });
    }, []);

    // Memoize the hover handler
    const handleNodeHover = useCallback((id: string | null) => {
        setHoveredNode(id);
    }, []);

    // Memoize category entries
    const categoryEntries = useMemo(() => Object.entries(categoryColors), []);

    return (
        <section ref={containerRef} className={styles.spatialContainer} aria-label="Interactive skills visualization">
            <ConnectionLines
                connections={connections}
                dimensions={dimensions}
                hoveredNode={hoveredNode}
                prefersReducedMotion={!!prefersReducedMotion}
            />

            {skillNodes.map((node, index) => (
                <SkillNodeComponent
                    key={node.id}
                    node={node}
                    nodeIndex={index}
                    isHovered={hoveredNode === node.id}
                    onHover={handleNodeHover}
                    prefersReducedMotion={!!prefersReducedMotion}
                />
            ))}

            <div className={styles.legend} role="list" aria-label="Skill categories">
                {categoryEntries.map(([category, colors]) => (
                    <div key={category} className={styles.legendItem} role="listitem">
                        <span className={styles.legendDot} style={{ background: colors.main }} aria-hidden="true" />
                        <span className={styles.legendLabel}>
                            {category.replace(/-/g, ' ').charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
