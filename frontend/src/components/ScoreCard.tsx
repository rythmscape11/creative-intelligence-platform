'use client';

import { Trophy, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ScoreCardProps {
    data: NonNullable<AnalysisResult['score']>;
}

export default function ScoreCard({ data }: ScoreCardProps) {
    const { overall_score, confidence_band, decision_summary, confidence } = data;

    const getScoreColor = (s: number) => {
        if (s >= 75) return 'text-green-400';
        if (s >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    // Calculate stroke for SVG circle
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (overall_score / 100) * circumference;

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Overall Score</h3>
                </div>
                <div className="text-right">
                    <p className="text-white/60 text-xs">
                        Confidence: {confidence} ({confidence_band[0]} - {confidence_band[1]})
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score Dial */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="40"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="40"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="score-dial transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4ade80" />
                                <stop offset="50%" stopColor="#facc15" />
                                <stop offset="100%" stopColor="#f87171" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(overall_score)}`}>
                            {Math.round(overall_score)}
                        </span>
                        <span className="text-xs text-white/50">/ 100</span>
                    </div>
                </div>

                {/* Decision Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <SummaryItem
                        label="Run Decision"
                        value={decision_summary.run_decision}
                        icon={<TrendingUp className="w-4 h-4" />}
                    />
                    <SummaryItem
                        label="Platform Fit"
                        value={decision_summary.platform_fit}
                        icon={<Target className="w-4 h-4" />}
                    />
                    <div className="col-span-1 sm:col-span-2 bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-purple-300 mb-1">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs">Success Rationale</span>
                        </div>
                        <p className="text-sm text-white/90">{decision_summary.success_rationale}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 text-purple-300 mb-1">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <p className="text-sm font-medium text-white">{value}</p>
        </div>
    );
}
