'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * HeroOrbit - Clean, minimal orbital logo animation
 * 
 * Features:
 * - Multi-layered hexagonal logo with gradient effects
 * - Subtle rotating orbit rings with minimal dots
 * - No floating labels for distraction-free enterprise design
 */

export function HeroOrbit() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-[280px] h-[280px] md:w-[500px] md:h-[500px]" />;

    return (
        <div className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] flex items-center justify-center">
            {/* Background Glow - Subtle blue/violet gradient */}
            <div className="absolute inset-0 bg-gradient-radial from-[#3B82F6]/20 via-[#A78BFA]/5 to-transparent blur-3xl opacity-50" />

            {/* Central Core - Sophisticated multi-layer logo */}
            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                {/* Outer glow ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-[#3B82F6]/20"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Outer hexagon frame */}
                <div className="absolute inset-3 md:inset-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#A78BFA" />
                            </linearGradient>
                            <linearGradient id="hexFill" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0F172A" />
                                <stop offset="100%" stopColor="#1E293B" />
                            </linearGradient>
                        </defs>
                        {/* Hexagon shape */}
                        <polygon
                            points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                            fill="url(#hexFill)"
                            stroke="url(#hexGradient)"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                {/* Inner diamond logo */}
                <div className="relative z-20 flex flex-col items-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14">
                        <defs>
                            <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="50%" stopColor="#60A5FA" />
                                <stop offset="100%" stopColor="#A78BFA" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Outer diamond */}
                        <path
                            d="M24 2L44 24L24 46L4 24L24 2Z"
                            fill="url(#diamondGradient)"
                            filter="url(#glow)"
                        />
                        {/* Inner cut */}
                        <path
                            d="M24 10L36 24L24 38L12 24L24 10Z"
                            fill="#0F172A"
                            opacity="0.4"
                        />
                        {/* Center dot */}
                        <circle cx="24" cy="24" r="4" fill="#F1F5F9" opacity="0.9" />
                    </svg>
                    <span className="text-[10px] md:text-[12px] font-bold tracking-[0.25em] text-[#F1F5F9] mt-2 uppercase">Aureon</span>
                </div>

                {/* Animated pulse ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#3B82F6]/30"
                    animate={{ scale: [1, 1.4, 1.6], opacity: [0.4, 0.1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                />
            </div>

            {/* Orbit Ring 1 (Inner) - Subtle rotating ring */}
            <motion.div
                className="absolute border border-[#3B82F6]/15 rounded-full w-[220px] h-[220px] md:w-[320px] md:h-[320px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            </motion.div>

            {/* Orbit Ring 2 (Outer) - Even more subtle */}
            <motion.div
                className="absolute border border-[#A78BFA]/10 rounded-full w-[320px] h-[320px] md:w-[440px] md:h-[440px] hidden sm:block"
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            >
                <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-1.5 h-1.5 bg-[#A78BFA] rounded-full shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
            </motion.div>
        </div>
    );
}


