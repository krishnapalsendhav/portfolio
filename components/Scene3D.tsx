'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating particles network
function ParticleNetwork() {
    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    const particleCount = 80;

    const { positions, connections } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const conn: number[] = [];

        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }

        // Create connections between nearby particles
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 2) {
                    conn.push(
                        pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
                        pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
                    );
                }
            }
        }

        return { positions: pos, connections: new Float32Array(conn) };
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
        }
        if (linesRef.current) {
            linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
        }
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08}
                    color="#00f5ff"
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>

            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={connections.length / 3}
                        array={connections}
                        itemSize={3}
                        args={[connections, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#00f5ff"
                    transparent
                    opacity={0.15}
                />
            </lineSegments>
        </group>
    );
}

// Central glowing sphere
function CentralSphere() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;

            // React to mouse
            meshRef.current.position.x = mouse.x * 0.5;
            meshRef.current.position.y = mouse.y * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1.2, 64, 64]}>
                <MeshDistortMaterial
                    color="#0a0a1a"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>

            {/* Glow ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.8, 0.02, 16, 100]} />
                <meshBasicMaterial color="#00f5ff" transparent opacity={0.6} />
            </mesh>

            {/* Second ring */}
            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <torusGeometry args={[2.2, 0.015, 16, 100]} />
                <meshBasicMaterial color="#bf00ff" transparent opacity={0.4} />
            </mesh>
        </Float>
    );
}

// Floating geometric shapes
function FloatingShapes() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={group}>
            {/* Floating octahedrons */}
            {[...Array(5)].map((_, i) => (
                <Float key={i} speed={1 + i * 0.5} rotationIntensity={2} floatIntensity={2}>
                    <mesh
                        position={[
                            Math.cos(i * 1.2) * 4,
                            Math.sin(i * 0.8) * 2,
                            Math.sin(i * 1.5) * 3 - 2
                        ]}
                    >
                        <octahedronGeometry args={[0.15]} />
                        <meshBasicMaterial
                            color={i % 2 === 0 ? '#00f5ff' : '#bf00ff'}
                            wireframe
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

export default function Scene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bf00ff" />

            <CentralSphere />
            <ParticleNetwork />
            <FloatingShapes />
        </Canvas>
    );
}
