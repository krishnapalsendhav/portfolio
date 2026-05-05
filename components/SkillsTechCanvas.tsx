'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styles from './SkillsTechCanvas.module.css';

const TECH = [
    'Flutter', 'Dart', 'Firebase', 'Node.js',
    'PostgreSQL', 'MongoDB', 'Docker', 'Git',
    'OpenAI', 'Python', 'JavaScript', 'TypeScript',
];

/** Evenly distribute n points on a sphere of radius r (Fibonacci / golden angle) */
function fibSphere(n: number, r: number): THREE.Vector3[] {
    const pts: THREE.Vector3[] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle ≈ 2.399 rad
    for (let i = 0; i < n; i++) {
        const y = (1 - (i / (n - 1)) * 2) * r;
        const rr = Math.sqrt(Math.max(0, r * r - y * y));
        const theta = phi * i;
        pts.push(new THREE.Vector3(Math.cos(theta) * rr, y, Math.sin(theta) * rr));
    }
    return pts;
}

export default function SkillsTechCanvas() {
    const mountRef = useRef<HTMLDivElement>(null);
    const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ── Renderer ──────────────────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // ── Scene & Camera ────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
        camera.position.z = 7.5;

        // ── Constellation group (everything rotates together) ─────────────────
        const group = new THREE.Group();
        const N = TECH.length;
        const positions = fibSphere(N, 2.7);

        const sphereGeo = new THREE.SphereGeometry(0.075, 14, 14);
        const haloGeo = new THREE.SphereGeometry(0.26, 14, 14);

        const nodeMeshes: THREE.Mesh[] = [];

        positions.forEach(pos => {
            // Bright core
            const core = new THREE.Mesh(
                sphereGeo,
                new THREE.MeshBasicMaterial({ color: 0x89e900 }),
            );
            core.position.copy(pos);
            group.add(core);
            nodeMeshes.push(core);

            // Soft glow halo
            const halo = new THREE.Mesh(
                haloGeo,
                new THREE.MeshBasicMaterial({
                    color: 0x89e900, transparent: true, opacity: 0.07, side: THREE.BackSide,
                }),
            );
            halo.position.copy(pos);
            group.add(halo);
        });

        // Edge lines — connect nodes that are close enough
        const lineVerts: number[] = [];
        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
                if (positions[i].distanceTo(positions[j]) < 2.4) {
                    lineVerts.push(...positions[i].toArray(), ...positions[j].toArray());
                }
            }
        }
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
        group.add(new THREE.LineSegments(
            lineGeo,
            new THREE.LineBasicMaterial({ color: 0x89e900, transparent: true, opacity: 0.13 }),
        ));

        scene.add(group);

        // Ambient star field (fixed — doesn't rotate with constellation)
        const starGeo = new THREE.BufferGeometry();
        const starArr = new Float32Array(200 * 3);
        for (let i = 0; i < 200; i++) {
            starArr[i * 3] = (Math.random() - 0.5) * 18;
            starArr[i * 3 + 1] = (Math.random() - 0.5) * 12;
            starArr[i * 3 + 2] = (Math.random() - 0.5) * 14;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starArr, 3));
        scene.add(new THREE.Points(
            starGeo,
            new THREE.PointsMaterial({ color: 0x89e900, size: 0.022, transparent: true, opacity: 0.16, sizeAttenuation: true }),
        ));

        // ── Resize ────────────────────────────────────────────────────────────
        const resize = () => {
            const w = mount.offsetWidth;
            const h = mount.offsetHeight;
            if (!w || !h) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        // ── Mouse parallax ────────────────────────────────────────────────────
        let tRotX = 0, tRotY = 0;
        const onMouse = (e: globalThis.MouseEvent) => {
            const r = mount.getBoundingClientRect();
            tRotY = ((e.clientX - r.left) / r.width - 0.5) * 1.4;
            tRotX = -((e.clientY - r.top) / r.height - 0.5) * 0.8;
        };
        const onLeave = () => { tRotX = 0; tRotY = 0; };
        mount.addEventListener('mousemove', onMouse);
        mount.addEventListener('mouseleave', onLeave);

        // ── Animation ─────────────────────────────────────────────────────────
        let rafId: number;
        let autoY = 0;
        let dampX = 0, dampY = 0;
        const _wp = new THREE.Vector3();

        const animate = () => {
            rafId = requestAnimationFrame(animate);

            if (!prefersReduced) {
                autoY += 0.004;
                dampX += (tRotX - dampX) * 0.04;
                dampY += (tRotY - dampY) * 0.04;
                group.rotation.y = autoY + dampY;
                group.rotation.x = dampX;
            }

            // Project each node's world position → screen coords → label
            const w = mount.offsetWidth;
            const h = mount.offsetHeight;

            labelsRef.current.forEach((el, i) => {
                if (!el || !nodeMeshes[i]) return;
                nodeMeshes[i].getWorldPosition(_wp);

                const ndc = _wp.clone().project(camera);
                if (ndc.z > 1) { el.style.opacity = '0'; return; }

                const sx = ((ndc.x + 1) / 2) * w;
                const sy = ((-ndc.y + 1) / 2) * h;

                // Depth cue — nodes behind equator appear dimmer
                const depth = (_wp.z + 3.2) / 6.4;          // 0 (back) → 1 (front)
                const opacity = (0.28 + depth * 0.72).toFixed(2);

                el.style.left = `${sx}px`;
                el.style.top = `${sy}px`;
                el.style.opacity = opacity;
            });

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(rafId);
            mount.removeEventListener('mousemove', onMouse);
            mount.removeEventListener('mouseleave', onLeave);
            ro.disconnect();
            sphereGeo.dispose();
            haloGeo.dispose();
            lineGeo.dispose();
            starGeo.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className={styles.wrapper}>
            <div className={styles.labels}>
                {TECH.map((name, i) => (
                    <span
                        key={name}
                        ref={el => { labelsRef.current[i] = el; }}
                        className={styles.label}
                    >
                        {name}
                    </span>
                ))}
            </div>
        </div>
    );
}
