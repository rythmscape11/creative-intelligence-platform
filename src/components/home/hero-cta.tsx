'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export function HeroCTA() {
    const { isSignedIn, isLoaded } = useUser();

    // Default to signup link while loading to avoid layout shift or flashing
    // Most users visiting home are likely not signed in
    const href = isLoaded && isSignedIn ? '/dashboard' : '/auth/signup';
    const text = isLoaded && isSignedIn ? 'Go to Dashboard' : 'Start 60-Day Free Trial';

    return (
        <Link href={href}>
            <Button size="lg" className="relative text-base sm:text-lg px-8 py-6 h-auto group overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 bg-white hover:bg-gray-100 text-black border-none rounded-full">
                <span className="relative z-10 flex items-center font-medium">
                    {text}
                    <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </span>
            </Button>
        </Link>
    );
}
