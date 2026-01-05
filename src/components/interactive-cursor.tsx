'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export function InteractiveCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      mousePos.current = { x: newX, y: newY };

      // Calculate velocity
      const dx = newX - lastPos.current.x;
      const dy = newY - lastPos.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      // Create particles based on velocity
      if (velocity > 2) {
        const numParticles = Math.min(Math.floor(velocity / 10), 3);
        const newParticles: Particle[] = [];

        for (let i = 0; i < numParticles; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2 + 1;
          const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

          newParticles.push({
            x: newX + (Math.random() - 0.5) * 10,
            y: newY + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            maxLife: 1,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        setParticles(prev => [...prev, ...newParticles].slice(-100)); // Keep max 100 particles
      }

      lastPos.current = { x: newX, y: newY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // Gravity
            life: particle.life - 0.02,
          }))
          .filter(particle => particle.life > 0);

        // Draw particles
        updatedParticles.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw cursor glow
        const gradient = ctx.createRadialGradient(
          mousePos.current.x,
          mousePos.current.y,
          0,
          mousePos.current.x,
          mousePos.current.y,
          50
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          mousePos.current.x - 50,
          mousePos.current.y - 50,
          100,
          100
        );

        return updatedParticles;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

/**
 * Mesh Grid Cursor Effect
 * Creates an interactive mesh that follows the cursor
 */
export function MeshCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create grid points
    const gridSize = 30;
    const points: { x: number; y: number; baseX: number; baseY: number }[] = [];

    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        points.push({ x, y, baseX: x, baseY: y });
      }
    }

    const animate = () => {
      // Smooth mouse movement
      mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.1;
      mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw grid
      points.forEach(point => {
        const dx = mousePos.current.x - point.baseX;
        const dy = mousePos.current.y - point.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 20;
          point.x = point.baseX + (dx / distance) * force;
          point.y = point.baseY + (dy / distance) * force;
        } else {
          point.x += (point.baseX - point.x) * 0.1;
          point.y += (point.baseY - point.y) * 0.1;
        }

        // Draw point
        const opacity = distance < maxDistance ? (1 - distance / maxDistance) * 0.5 : 0.1;
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < gridSize * 1.5) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 opacity-30"
    />
  );
}

