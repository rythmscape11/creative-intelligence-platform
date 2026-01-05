'use client';

import Image from 'next/image';

export function Logo3D({ className = "w-32 h-32" }: { className?: string }) {
    return (
        <div className={`${className} relative flex items-center justify-center group`}>
            {/* Running Water / Glass Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Layer 1: Deep Blue Water */}
                <div className="absolute w-[110%] h-[110%] bg-blue-600/30 animate-morph animate-spin-very-slow blur-xl" />

                {/* Layer 2: Lighter Cyan Water (Reverse Spin) */}
                <div className="absolute w-[105%] h-[105%] bg-cyan-500/30 animate-morph blur-lg" style={{ animationDirection: 'reverse', animationDuration: '10s' }} />

                {/* Layer 3: Glassy Highlight Overlay */}
                <div className="absolute w-[100%] h-[100%] bg-white/10 animate-morph blur-md border border-white/20" style={{ animationDuration: '6s' }} />
            </div>

            <Image
                src="/images/logos/mediaplanpro-logo.png"
                alt="MediaPlanPro 3D Logo"
                fill
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 transition-transform duration-700 ease-in-out group-hover:scale-105"
                priority
            />
        </div>
    );
}
