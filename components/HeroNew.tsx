'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import styles from './HeroNew.module.css';

// Dynamic import — keeps Three.js out of SSR bundle
const AiTerminal3D = dynamic(() => import('./AiTerminal3D'), {
    ssr: false,
    loading: () => <div className={styles.terminalLoader} />,
});

// ─── WebGL Perspective Grid ───────────────────────────────────────────────────
function PerspectiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Respect user motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let w = 0, h = 0, t = 0;

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const onMouse = (e: MouseEvent) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2,
            };
        };
        window.addEventListener('mousemove', onMouse);

        const draw = () => {
            t += 0.007;
            ctx.clearRect(0, 0, w, h);

            const breathe = Math.sin(t) * 0.04 + 1;
            const driftX = mouseRef.current.x * 14;
            const driftY = mouseRef.current.y * 7;
            const horizon = h * (0.52 + Math.sin(t * 0.5) * 0.01) + driftY;
            const vanishX = w / 2 + driftX;

            const cols = 14, rows = 10;

            ctx.save();

            // Horizontal lines
            for (let i = 0; i <= rows; i++) {
                const pct = i / rows;
                const curve = Math.pow(pct, 2.2);
                const y = horizon + (h - horizon) * curve;
                const alpha = Math.max(0, pct * 0.45 * breathe);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.strokeStyle = `rgba(137, 233, 0,${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Vertical perspective lines
            for (let i = 0; i <= cols; i++) {
                const pct = i / cols;
                const bx = w * pct;
                const alpha = 0.25 * breathe * (1 - Math.abs(pct - 0.5) * 1.4);
                ctx.beginPath();
                ctx.moveTo(vanishX, horizon);
                ctx.lineTo(bx, h);
                ctx.strokeStyle = `rgba(137, 233, 0,${Math.max(0, alpha)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // Horizon glow
            const glow = ctx.createLinearGradient(0, horizon - 8, 0, horizon + 8);
            glow.addColorStop(0, 'rgba(137, 233, 0,0)');
            glow.addColorStop(0.5, `rgba(137, 233, 0,${0.12 * breathe})`);
            glow.addColorStop(1, 'rgba(137, 233, 0,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, horizon - 8, w, 16);

            ctx.restore();
            rafRef.current = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouse);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.gridCanvas} aria-hidden />;
}


// ─── Animation helpers ────────────────────────────────────────────────────────
const ease = [0.4, 0, 0.2, 1] as const;


// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function HeroNew() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

    return (
        <section id="home" ref={containerRef} className={styles.hero}>
            <PerspectiveGrid />
            <div className={styles.gradientOverlay} />
            <div className={styles.gridOverlay} />

            <motion.div className={styles.content} style={{ y, opacity }}>

                {/* ── LEFT ─────────────────────────────────────────── */}
                <div className={styles.left}>
                    {/* Status badge */}
                    <motion.div
                        className={styles.badge}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease }}
                    >
                        <span className={styles.badgeDot} />
                        Open to opportunities
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 56, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.95, delay: 0.15, ease }}
                    >
                        <span className={styles.firstName}>Krishnapal</span>
                        <span className={styles.lastName}>Sendhav</span>
                    </motion.h1>

                    {/* Roles */}
                    <motion.div
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.55, ease }}
                    >
                        <span className={styles.tagline}>Flutter Developer</span>
                        <span className={styles.taglineDivider} />
                        <span className={styles.taglineSecondary}>Backend Engineer</span>
                        <span className={styles.taglineDivider} />
                        <span className={styles.taglineSecondary}>AI Integrator</span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        className={styles.description}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7, ease }}
                    >
                        I build performant cross-platform apps, scalable backend
                        systems, and AI-powered experiences. Currently at ClassIO,
                        shipping software used by 50,000+ users.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        className={styles.cta}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.85, ease }}
                    >
                        <a href="#projects" className={styles.ctaButton}>
                            View Projects
                        </a>
                        <a
                            href="/Krishnapal-Sendhav-Resume.pdf"
                            className={styles.ctaSecondary}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FiDownload size={12} />
                            Resume
                        </a>
                        <a
                            href="https://github.com/krishnapalsendhav"
                            className={styles.ctaSecondary}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <FiGithub size={12} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/krishnapal-sendhav/"
                            className={styles.ctaSecondary}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FiLinkedin size={12} />
                        </a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className={styles.stats}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.05, ease }}
                    >
                        <div className={styles.stat}>
                            <span className={styles.statValue}>50K+</span>
                            <span className={styles.statLabel}>Active Users</span>
                        </div>
                        <span className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statValue}>3+</span>
                            <span className={styles.statLabel}>Years</span>
                        </div>
                        <span className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statValue}>10+</span>
                            <span className={styles.statLabel}>Production Apps</span>
                        </div>
                    </motion.div>
                </div>

                {/* ── RIGHT — 3D AI Terminal ────────────────────────── */}
                <motion.div
                    className={styles.right}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.5, ease }}
                >
                    <AiTerminal3D />
                </motion.div>

            </motion.div>

            {/* Scroll cue */}
            <div className={styles.scrollIndicator}>
                <span>Scroll</span>
                <div className={styles.scrollLine} />
            </div>
        </section>
    );
}
