'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styles from './ProjectsThreeBackground.module.css';

export default function ProjectsThreeBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect reduced-motion preference
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ── Renderer ────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        // ── Scene & Camera ───────────────────────────────────────────────
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
        camera.position.z = 7;

        // ── Particle layers at different Z depths ────────────────────────
        // Near particles appear to move faster during scroll (natural parallax)
        const makeLayer = (count: number, spread: number, zRange: number, opacity: number) => {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                pos[i * 3] = (Math.random() - 0.5) * spread;
                pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
                pos[i * 3 + 2] = (Math.random() - 0.5) * zRange;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({
                color: 0x89e900,
                size: 0.036,
                transparent: true,
                opacity,
                sizeAttenuation: true,
                depthWrite: false,
            });
            return new THREE.Points(geo, mat);
        };

        // Far → dim, near → slightly brighter; 3 layers = 3 apparent speeds on scroll
        const far = makeLayer(70, 28, 14, 0.10);
        const mid = makeLayer(110, 22, 6, 0.22);
        const near = makeLayer(60, 18, 2, 0.38);

        scene.add(far, mid, near);

        // ── Resize ───────────────────────────────────────────────────────
        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const w = parent.offsetWidth;
            const h = parent.offsetHeight;
            if (w === 0 || h === 0) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement!);

        // ── Scroll parallax ──────────────────────────────────────────────
        let targetCamY = 0;
        let currentCamY = 0;

        const onScroll = () => {
            const section = canvas.closest('section');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const sectionH = section.offsetHeight;
            // Normalise scroll progress through this section
            const progress = -rect.top / (sectionH + window.innerHeight);
            targetCamY = progress * 3.5;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // ── Animation loop ───────────────────────────────────────────────
        let rafId: number;
        const lerpSpeed = prefersReduced ? 1 : 0.04;
        const driftSpeed = prefersReduced ? 0 : 1;

        const animate = () => {
            rafId = requestAnimationFrame(animate);

            // Smooth inertia on camera Y (parallax)
            currentCamY += (targetCamY - currentCamY) * lerpSpeed;
            camera.position.y = -currentCamY;

            // Slow per-layer drift — each layer at a different rate adds depth
            near.rotation.y += 0.00025 * driftSpeed;
            mid.rotation.y += 0.00015 * driftSpeed;
            far.rotation.y += 0.00008 * driftSpeed;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', onScroll);
            ro.disconnect();
            [far, mid, near].forEach(p => {
                (p.geometry as THREE.BufferGeometry).dispose();
                (p.material as THREE.PointsMaterial).dispose();
            });
            renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
