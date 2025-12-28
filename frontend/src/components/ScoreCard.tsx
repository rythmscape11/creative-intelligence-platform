'use client'

import { Trophy, TrendingUp, Target } from 'lucide-react'

interface ScoreCardProps {
    score: number
    confidence: [number, number]
    explanation: string
    funnelFit: number
    platformFit: number
}

export default function ScoreCard({ score, confidence, explanation, funnelFit, platformFit }: ScoreCardProps) {
    const getScoreColor = (s: number) => {
        if (s >= 75) return 'text-emerald-500'
        if (s >= 50) return 'text-amber-500'
        return 'text-red-500'
    }

    const getScoreGradient = (s: number) => {
        if (s >= 75) return 'from-emerald-500 to-teal-500'
        if (s >= 50) return 'from-amber-500 to-orange-500'
        return 'from-red-500 to-rose-500'
    }

    // Calculate stroke for SVG circle
    const circumference = 2 * Math.PI * 40
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
        <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-slate-900">Overall Score</h3>
            </div>

            {/* Score Dial */}
            <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="40"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="12"
                        />
                        {/* Score circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="40"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="score-dial"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0ea5e9" />
                                <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}</span>
                        <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                </div>
            </div>

            {/* Confidence Band */}
            <p className="text-xs text-center text-slate-500 mb-4">
                Confidence: {confidence[0].toFixed(0)} – {confidence[1].toFixed(0)}
            </p>

            {/* Explanation */}
            <p className="text-sm text-slate-600 text-center mb-6">{explanation}</p>

            {/* Fit Scores */}
            <div className="grid grid-cols-2 gap-4">
                <FitScore icon={<TrendingUp className="w-4 h-4" />} label="Funnel Fit" score={funnelFit} />
                <FitScore icon={<Target className="w-4 h-4" />} label="Platform Fit" score={platformFit} />
            </div>
        </div>
    )
}

function FitScore({ icon, label, score }: { icon: React.ReactNode; label: string; score: number }) {
    return (
        <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <span className="text-lg font-semibold text-slate-900">{Math.round(score)}</span>
        </div>
    )
}
