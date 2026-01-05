'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface MouseParallaxProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Mouse Parallax Component
 * Creates smooth parallax effect that follows mouse movement
 */
export function MouseParallax({ children, strength = 20, className = '' }: MouseParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate mouse position as percentage (-1 to 1)
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      // Apply transform
      const xMove = xPercent * strength;
      const yMove = yPercent * strength;

      element.style.transform = `translate(${xMove}px, ${yMove}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Parallax Layer Component
 * Creates depth-based parallax scrolling effect
 */
export function ParallaxLayer({ children, speed = 0.5, className = '' }: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const yPos = -(scrolled * speed);
      layer.style.transform = `translateY(${yPos}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return (
    <div
      ref={layerRef}
      className={className}
      style={{
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Magnetic Button Component
 * Button that follows cursor when nearby
 */
export function MagneticButton({ children, strength = 0.3, className = '', onClick, style }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - buttonCenterX;
      const distanceY = e.clientY - buttonCenterY;

      // Calculate distance from center
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const maxDistance = 150; // Magnetic effect radius

      if (distance < maxDistance) {
        const pull = (maxDistance - distance) / maxDistance;
        const moveX = distanceX * strength * pull;
        const moveY = distanceY * strength * pull;

        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        button.style.transform = 'translate(0, 0)';
      }
    };

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      className={className}
      onClick={onClick}
      style={{
        ...style,
        transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform'
      }}
    >
      {children}
    </button>
  );
}

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Tilt Card Component
 * Card that tilts based on mouse position
 */
export function TiltCard({ children, className = '', maxTilt = 10 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;

      const rotateX = (mouseY / (rect.height / 2)) * maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}

interface CursorFollowerProps {
  size?: number;
  color?: string;
  blur?: number;
}

/**
 * Cursor Follower Component
 * Creates a smooth cursor following effect
 */
export function CursorFollower({ size = 40, color = 'rgba(168, 216, 234, 0.3)', blur = 30 }: CursorFollowerProps) {
  const followerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      follower.style.display = 'none';
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Smooth lerp animation
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.1;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.1;

      follower.style.left = `${positionRef.current.x}px`;
      follower.style.top = `${positionRef.current.y}px`;

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={followerRef}
      className="pointer-events-none fixed z-50"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        filter: `blur(${blur}px)`,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'multiply'
      }}
    />
  );
}

