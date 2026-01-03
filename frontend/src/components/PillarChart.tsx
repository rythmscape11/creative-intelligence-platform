'use client';

import { BarChart3 } from 'lucide-react';
import { Pillar } from '@/types';

interface PillarChartProps {
    pillars: Pillar[];
}

export default function PillarChart({ pillars }: PillarChartProps) {
    const formatName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const getBarColor = (score: number) => {
        if (score >= 75) return 'bg-green-400';
        if (score >= 50) return 'bg-yellow-400';
        return 'bg-red-400';
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-full">
            <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Pillar Breakdown</h3>
            </div>

            <div className="space-y-4">
                {pillars.map((pillar) => (
                    <div key={pillar.name} className="group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-white/80">
                                {formatName(pillar.name)}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${pillar.confidence === 'high' ? 'bg-green-500/20 text-green-300' :
                                        pillar.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-red-500/20 text-red-300'
                                    }`}>
                                    {pillar.confidence}
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {Math.round(pillar.score)}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(pillar.score)}`}
                                style={{ width: `${pillar.score}%` }}
                            />
                        </div>

                        {/* Explanation */}
                        <p className="text-xs text-purple-200 mt-1 opacity-80">
                            {pillar.explanation.boardroom_summary}
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                            Fix: {pillar.explanation.what_to_fix_first}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
