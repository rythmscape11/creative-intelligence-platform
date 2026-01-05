'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TrialTimerProps {
    trialEnd: Date;
}

export function TrialTimer({ trialEnd }: TrialTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(trialEnd).getTime() - new Date().getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft(null);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [trialEnd]);

    if (!timeLeft) return null;

    return (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border-none text-white shadow-xl mb-6 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-purple-500 rounded-full opacity-20 blur-xl"></div>

            <CardContent className="flex flex-col sm:flex-row items-center justify-between p-5 relative z-10">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30 backdrop-blur-sm">
                        <Clock className="h-6 w-6 text-indigo-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight">Pro Trial Active</h3>
                        <p className="text-gray-400 text-sm">
                            Full access to premium features
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex gap-3 text-center">
                        <div className="bg-white/5 rounded-lg p-2 min-w-[60px] border border-white/10">
                            <div className="text-xl font-bold font-mono text-white">{timeLeft.days}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Days</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 min-w-[60px] border border-white/10">
                            <div className="text-xl font-bold font-mono text-white">{timeLeft.hours}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Hours</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 min-w-[60px] border border-white/10">
                            <div className="text-xl font-bold font-mono text-white">{timeLeft.minutes}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Mins</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 min-w-[60px] border border-white/10">
                            <div className="text-xl font-bold font-mono text-white">{timeLeft.seconds}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Secs</div>
                        </div>
                    </div>

                    <Button
                        asChild
                        size="sm"
                        className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/20"
                    >
                        <Link href="/pricing">
                            <Zap className="mr-2 h-4 w-4" />
                            Upgrade
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
