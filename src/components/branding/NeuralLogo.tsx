// @ts-nocheck
'use client';

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================================
// FULL-SCREEN INTERACTIVE CONSTELLATION
// Features: Grey particles, magnetic mouse, pulsating organic effect, touch support
// ============================================================================

// Node fragment shader - Grey with organic pulsating glow
const nodeFragmentShader = `
  varying float vAlpha;
  varying float vPulse;
  varying float vMouseDist;
  
  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;
    
    // Soft glowing particle - BRIGHTER
    float core = 1.0 - smoothstep(0.0, 0.2, r);
    float glow = 1.0 - smoothstep(0.2, 1.0, r);
    float intensity = core * 1.8 + glow * 0.9;
    
    // Grey base with subtle blue-white tint - MORE VISIBLE
    vec3 greyColor = vec3(0.7, 0.75, 0.8);
    vec3 glowColor = vec3(0.7, 0.8, 0.95);
    vec3 pulseColor = vec3(0.6, 0.7, 0.85);
    
    // Pulsating organic brightness
    float pulse = vPulse * 0.3;
    
    // Brighter near mouse
    float mouseGlow = smoothstep(1.0, 0.0, vMouseDist) * 0.5;
    
    vec3 finalColor = mix(greyColor, glowColor, core + pulse + mouseGlow);
    
    gl_FragColor = vec4(finalColor, intensity * vAlpha);
  }
`;

// Line fragment shader - Visible strings with mouse magnetism
const lineFragmentShader = `
  varying float vAlpha;
  varying float vPulse;
  varying float vMouseDist;
  
  void main() {
    // Lines glow brighter near mouse (magnetic effect) - MORE VISIBLE
    float baseBrightness = 0.4;
    float mouseGlow = smoothstep(1.0, 0.0, vMouseDist) * 0.6;
    float pulseBrightness = vPulse * 0.2;
    
    float brightness = baseBrightness + mouseGlow + pulseBrightness;
    
    // Grey-blue lines - BRIGHTER
    vec3 lineColor = mix(vec3(0.5, 0.55, 0.65), vec3(0.7, 0.8, 1.0), mouseGlow + vPulse * 0.5);
    
    gl_FragColor = vec4(lineColor, vAlpha * brightness);
  }
`;

// Vertex shader with magnetic mouse effect and organic pulsing
const interactiveVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  
  attribute vec3 aTargetPos;
  attribute float aRandomSize;
  attribute float aDelay;
  attribute float aPulseOffset;
  
  varying float vAlpha;
  varying float vPulse;
  varying float vMouseDist;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // Smooth entrance animation
    float delayedProgress = max(0.0, uProgress - aDelay * 0.15);
    float easedProgress = smoothstep(0.0, 1.0, delayedProgress);
    
    // Start scattered, converge to target
    vec3 startPos = aTargetPos + vec3(
      snoise(aTargetPos * 0.08) * 35.0,
      snoise(aTargetPos * 0.09 + 50.0) * 35.0,
      snoise(aTargetPos * 0.07 + 100.0) * 25.0
    );
    
    vec3 currentPos = mix(startPos, aTargetPos, easedProgress);
    
    // ORGANIC PULSATING - Each particle pulses at slightly different rate
    float pulseSpeed = 1.5 + aPulseOffset * 0.8;
    float pulsePhase = uTime * pulseSpeed + aPulseOffset * 6.28;
    float pulse = sin(pulsePhase) * 0.5 + 0.5;
    
    // Gentle organic breathing movement
    float breathe = snoise(vec3(currentPos.x * 0.03, currentPos.y * 0.03, uTime * 0.15));
    currentPos += vec3(
      sin(uTime * 0.2 + aTargetPos.y * 0.1) * 0.3,
      cos(uTime * 0.15 + aTargetPos.x * 0.1) * 0.3,
      breathe * 0.8
    );
    
    // MAGNETIC MOUSE EFFECT - Strong attraction/repulsion
    float dist = distance(currentPos.xy, uMouse.xy);
    float normalizedDist = dist / uMouseRadius;
    vMouseDist = clamp(normalizedDist, 0.0, 1.0);
    
    if (dist < uMouseRadius) {
      vec3 toMouse = vec3(uMouse.xy, 0.0) - currentPos;
      vec3 dir = normalize(toMouse);
      
      // Magnetic pull toward mouse (attraction)
      float attractStrength = pow(1.0 - normalizedDist, 2.0) * 3.0;
      currentPos += dir * attractStrength;
      
      // Also push slightly in Z for depth effect
      currentPos.z += (1.0 - normalizedDist) * 2.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size varies with pulse and mouse proximity
    float sizeMultiplier = 1.0 + pulse * 0.3 + (1.0 - vMouseDist) * 0.5;
    gl_PointSize = aRandomSize * sizeMultiplier * (90.0 / -mvPosition.z);
    
    vAlpha = smoothstep(0.0, 0.25, easedProgress);
    vPulse = pulse;
  }
`;

// ============================================================================
// GENERATE FULL-SCREEN PARTICLES
// ============================================================================
function generateFullScreenParticles(count: number, width: number, height: number): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * width;
        const y = (Math.random() - 0.5) * height;
        const z = (Math.random() - 0.5) * 15;
        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

// Generate connections between nearby particles
function generateConnections(points: THREE.Vector3[], maxDist: number, maxConnections: number): Uint16Array {
    const indices: number[] = [];

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const neighbors: { idx: number; dist: number }[] = [];

        for (let j = i + 1; j < points.length; j++) {
            const d = p1.distanceTo(points[j]);
            if (d < maxDist) {
                neighbors.push({ idx: j, dist: d });
            }
        }

        neighbors.sort((a, b) => a.dist - b.dist);
        for (const n of neighbors.slice(0, maxConnections)) {
            indices.push(i, n.idx);
        }
    }

    return new Uint16Array(indices);
}

// ============================================================================
// INTERACTIVE CONSTELLATION MESH
// ============================================================================
function InteractiveConstellation({ points, mouseRadius }: { points: THREE.Vector3[], mouseRadius: number }) {
    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const pointsMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const linesMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const mousePos = useRef(new THREE.Vector3(100, 100, 0)); // Start off-screen

    const { positions, targetPositions, randomSizes, delays, pulseOffsets, indices } = useMemo(() => {
        const count = points.length;
        const positions = new Float32Array(count * 3);
        const targetPositions = new Float32Array(count * 3);
        const randomSizes = new Float32Array(count);
        const delays = new Float32Array(count);
        const pulseOffsets = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Scattered start
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            targetPositions[i * 3] = points[i].x;
            targetPositions[i * 3 + 1] = points[i].y;
            targetPositions[i * 3 + 2] = points[i].z;

            randomSizes[i] = Math.random() * 1.0 + 0.6;
            delays[i] = Math.random() * 0.8;
            pulseOffsets[i] = Math.random(); // Different pulse phase for each particle
        }

        // Dense connections for string effect
        const indices = generateConnections(points, 6, 3);

        return { positions, targetPositions, randomSizes, delays, pulseOffsets, indices };
    }, [points]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Calculate mouse position in world space
        const mouse = state.mouse;
        const vec = new THREE.Vector3(mouse.x, mouse.y, 0);
        vec.unproject(state.camera);
        const dir = vec.sub(state.camera.position).normalize();
        const distance = -state.camera.position.z / dir.z;
        const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));

        // Smooth mouse tracking
        mousePos.current.lerp(pos, 0.15);

        if (pointsMaterialRef.current) {
            pointsMaterialRef.current.uniforms.uTime.value = time;
            pointsMaterialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
                pointsMaterialRef.current.uniforms.uProgress.value,
                1,
                0.02 // Faster entrance
            );
            pointsMaterialRef.current.uniforms.uMouse.value.copy(mousePos.current);
        }

        if (linesMaterialRef.current && pointsMaterialRef.current) {
            linesMaterialRef.current.uniforms.uTime.value = time;
            linesMaterialRef.current.uniforms.uProgress.value = pointsMaterialRef.current.uniforms.uProgress.value;
            linesMaterialRef.current.uniforms.uMouse.value.copy(mousePos.current);
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector3(100, 100, 0) },
        uMouseRadius: { value: mouseRadius },
    }), [mouseRadius]);

    return (
        <group>
            {/* Connection lines */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                    <bufferAttribute attach="attributes-aTargetPos" count={targetPositions.length / 3} array={targetPositions} itemSize={3} />
                    <bufferAttribute attach="index" count={indices.length} array={indices} itemSize={1} />
                    <bufferAttribute attach="attributes-aRandomSize" count={randomSizes.length} array={randomSizes} itemSize={1} />
                    <bufferAttribute attach="attributes-aDelay" count={delays.length} array={delays} itemSize={1} />
                    <bufferAttribute attach="attributes-aPulseOffset" count={pulseOffsets.length} array={pulseOffsets} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    ref={linesMaterialRef}
                    vertexShader={interactiveVertexShader}
                    fragmentShader={lineFragmentShader}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    uniforms={uniforms}
                />
            </lineSegments>

            {/* Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                    <bufferAttribute attach="attributes-aTargetPos" count={targetPositions.length / 3} array={targetPositions} itemSize={3} />
                    <bufferAttribute attach="attributes-aRandomSize" count={randomSizes.length} array={randomSizes} itemSize={1} />
                    <bufferAttribute attach="attributes-aDelay" count={delays.length} array={delays} itemSize={1} />
                    <bufferAttribute attach="attributes-aPulseOffset" count={pulseOffsets.length} array={pulseOffsets} itemSize={1} />
                </bufferGeometry>
                <shaderMaterial
                    ref={pointsMaterialRef}
                    vertexShader={interactiveVertexShader}
                    fragmentShader={nodeFragmentShader}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    uniforms={uniforms}
                />
            </points>
        </group>
    );
}

// ============================================================================
// TOUCH HANDLER COMPONENT
// ============================================================================
function TouchHandler({ onTouch }: { onTouch: (x: number, y: number) => void }) {
    const { gl } = useThree();

    useEffect(() => {
        const canvas = gl.domElement;

        const handleTouch = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
                onTouch(x, y);
            }
        };

        canvas.addEventListener('touchstart', handleTouch, { passive: false });
        canvas.addEventListener('touchmove', handleTouch, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', handleTouch);
            canvas.removeEventListener('touchmove', handleTouch);
        };
    }, [gl, onTouch]);

    return null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function NeuralLogo({ className }: { className?: string }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Responsive settings
    const particleCount = isMobile ? 300 : 800;
    const mouseRadius = isMobile ? 12 : 10;
    const width = isMobile ? 40 : 60;
    const height = isMobile ? 50 : 35;

    // Generate full-screen particles
    const points = useMemo(() => generateFullScreenParticles(particleCount, width, height), [particleCount, width, height]);

    const handleTouch = useCallback((x: number, y: number) => {
        // Touch is handled in the Three.js context
    }, []);

    return (
        <div
            className={`w-full h-full ${className || ''}`}
            style={{
                minHeight: '100vh',
                background: 'radial-gradient(ellipse at center, rgba(15, 18, 28, 1) 0%, rgba(5, 5, 10, 1) 70%)',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 30], fov: isMobile ? 70 : 55 }}
                dpr={[1, 2]}
                style={{ width: '100%', height: '100%', touchAction: 'none' }}
            >
                <ambientLight intensity={0.2} />
                <TouchHandler onTouch={handleTouch} />
                <InteractiveConstellation points={points} mouseRadius={mouseRadius} />
            </Canvas>
        </div>
    );
}
