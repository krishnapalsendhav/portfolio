'use client';

import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { FiArrowUp, FiArrowRight } from 'react-icons/fi';
import styles from './AiTerminal3D.module.css';

// ─── Suggestion Prompts ───────────────────────────────────────────────────────
const SUGGESTIONS = [
    'What projects have you shipped?',
    "What's your AI / LLM experience?",
    'Are you open to new opportunities?',
];

// ─── Three.js Background Scene ────────────────────────────────────────────────
function useThreeScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const crystalRef = useRef<THREE.Mesh | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const rafRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetRotRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;

        // ── Crystal / Icosahedron ──────────────────────────────────────────
        const crystalGeo = new THREE.IcosahedronGeometry(1.1, 0);

        // Solid face (semi-transparent bottle green fill)
        const solidMat = new THREE.MeshPhongMaterial({
            color: 0x0a0a0a,
            transparent: true,
            opacity: 0.25,
            side: THREE.FrontSide,
        });
        const solidMesh = new THREE.Mesh(crystalGeo, solidMat);
        scene.add(solidMesh);

        // Wireframe overlay (wattle accent)
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x89E900,
            wireframe: true,
            transparent: true,
            opacity: 0.55,
        });
        const wireMesh = new THREE.Mesh(crystalGeo, wireMat);
        scene.add(wireMesh);
        crystalRef.current = wireMesh;

        // ── Floating Particles ────────────────────────────────────────────
        const particleCount = 80;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x89E900,
            size: 0.025,
            transparent: true,
            opacity: 0.5,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
        particlesRef.current = particles;

        // ── Lights ────────────────────────────────────────────────────────
        const ambientLight = new THREE.AmbientLight(0x89E900, 0.3);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x89E900, 1.5, 10);
        pointLight.position.set(2, 2, 3);
        scene.add(pointLight);

        const backLight = new THREE.PointLight(0x0a0a0a, 1.2, 8);
        backLight.position.set(-2, -1, -2);
        scene.add(backLight);

        // ── Mouse tracking ────────────────────────────────────────────────
        const onMouse = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
                y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
            };
        };
        canvas.addEventListener('mousemove', onMouse);

        // ── Resize ───────────────────────────────────────────────────────
        const onResize = () => {
            if (!canvas) return;
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        // ── Animate ───────────────────────────────────────────────────────
        let t = 0;
        const animate = () => {
            t += 0.008;

            // Smooth target rotation towards mouse
            targetRotRef.current.x += (mouseRef.current.y * 0.4 - targetRotRef.current.x) * 0.05;
            targetRotRef.current.y += (mouseRef.current.x * 0.6 - targetRotRef.current.y) * 0.05;

            // Apply to solid and wire meshes
            solidMesh.rotation.x = targetRotRef.current.x + t * 0.18;
            solidMesh.rotation.y = targetRotRef.current.y + t * 0.22;
            wireMesh.rotation.x = solidMesh.rotation.x;
            wireMesh.rotation.y = solidMesh.rotation.y;

            // Breathing scale
            const breathe = 1 + Math.sin(t * 1.2) * 0.04;
            solidMesh.scale.setScalar(breathe);
            wireMesh.scale.setScalar(breathe);

            // Slowly drift particles
            particles.rotation.y = t * 0.04;
            particles.rotation.x = t * 0.02;

            renderer.render(scene, camera);
            rafRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            canvas.removeEventListener('mousemove', onMouse);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        };
    }, [canvasRef]);

    return mouseRef;
}

// ─── Messages ─────────────────────────────────────────────────────────────────
interface Msg { role: 'user' | 'system'; text: string }

// ─── Component ────────────────────────────────────────────────────────────────
export default function AiTerminal3D() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState<Msg[]>([]);
    const [typing, setTyping] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    // Initialise Three.js scene
    useThreeScene(canvasRef);

    // Auto-scroll — only trigger when there are messages to show, not on initial mount
    useEffect(() => {
        if (msgs.length === 0 && !typing) return;
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [msgs, typing]);

    // ── 3D card tilt on mouse move ─────────────────────────────────────────
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 → 0.5
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: cy * -14, y: cx * 18 });  // degrees
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    // ── 3D card tilt on touch (mobile / tablet) ───────────────────────────
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect || !touch) return;
        const cx = (touch.clientX - rect.left) / rect.width - 0.5;
        const cy = (touch.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: cy * -8, y: cx * 10 });  // softer tilt on touch
    };

    const handleTouchEnd = () => {
        setTilt({ x: 0, y: 0 });
    };

    // ── Submit logic ──────────────────────────────────────────────────────────
    const submit = (query: string) => {
        if (!query.trim()) return;
        setMsgs(prev => [...prev, { role: 'user', text: query.trim() }]);
        setInput('');
        setTyping(true);
        setTimeout(() => {
            sessionStorage.setItem('chat_pending_query', query.trim());
            router.push('/chat');
        }, 650);
    };

    const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit(input);
        }
    };

    const cardStyle: React.CSSProperties = {
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`,
        transition: tilt.x === 0 && tilt.y === 0
            ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)'
            : 'transform 0.12s cubic-bezier(0.4,0,0.2,1)',
    };

    return (
        <div
            ref={cardRef}
            className={`${styles.cardWrapper}${tilt.x !== 0 || tilt.y !== 0 ? ` ${styles.tilted}` : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={cardStyle}
        >
            {/* ── Three.js canvas (background) ── */}
            <canvas ref={canvasRef} className={styles.threeBg} aria-hidden />

            {/* ── Edge glow when hovered ── */}
            <div className={styles.edgeGlow} />

            {/* ── Terminal UI overlay ─────────────────────────────────── */}
            <div className={styles.terminal}>

                {/* Title bar */}
                <div className={styles.terminalBar}>
                    <span className={styles.terminalLabel}>AI Assistant</span>
                    <div className={styles.terminalDots}>
                        <span className={`${styles.dot} ${styles.dotR}`} />
                        <span className={`${styles.dot} ${styles.dotY}`} />
                        <span className={`${styles.dot} ${styles.dotG}`} />
                    </div>
                </div>

                {/* Messages */}
                <div className={styles.messages}>
                    {msgs.length === 0 && (
                        <div className={styles.greeting}>
                            <span className={styles.greetLabel}>System</span>
                            <p className={styles.greetText}>
                                Hi — I'm an AI trained on Krishnapal's experience,
                                projects and skills. Ask me anything.
                            </p>
                        </div>
                    )}

                    {msgs.map((m, i) =>
                        m.role === 'user' ? (
                            <div key={i} className={styles.msgUser}>
                                <span className={styles.msgUserLabel}>You</span>
                                <div className={styles.msgUserBubble}>{m.text}</div>
                            </div>
                        ) : (
                            <div key={i} className={styles.msgModel}>
                                <span className={styles.msgModelLabel}>Assistant</span>
                                <div className={styles.msgModelBubble}>{m.text}</div>
                            </div>
                        )
                    )}

                    {typing && (
                        <div className={styles.msgModel}>
                            <span className={styles.msgModelLabel}>Assistant</span>
                            <div className={styles.msgModelBubble}>
                                <div className={styles.typingDots}>
                                    <span /><span /><span />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Suggestions */}
                {msgs.length === 0 && (
                    <div className={styles.suggestions}>
                        {SUGGESTIONS.map(s => (
                            <button key={s} className={styles.suggBtn} onClick={() => submit(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input row */}
                <div className={styles.inputRow}>
                    <span className={styles.prompt}>›</span>
                    <textarea
                        className={styles.textarea}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Ask about my experience…"
                        rows={1}
                        disabled={typing}
                    />
                    <button
                        className={`${styles.sendBtn} ${input.trim() ? styles.sendActive : ''}`}
                        onClick={() => submit(input)}
                        disabled={!input.trim() || typing}
                        aria-label="Send"
                    >
                        <FiArrowUp size={12} />
                    </button>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <span className={styles.footerLabel}>Powered by AI</span>
                    <a href="/chat" className={styles.footerLink}>
                        Open full chat <FiArrowRight size={9} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    </a>
                </div>

            </div>
        </div>
    );
}
