'use client'

import { BarChart3 } from 'lucide-react'

interface Pillar {
    name: string
    score: number
    weight: number
    explanation: string
}

interface PillarChartProps {
    pillars: Pillar[]
}

export default function PillarChart({ pillars }: PillarChartProps) {
    const formatName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }

    const getBarColor = (score: number) => {
        if (score >= 75) return 'bg-gradient-to-r from-emerald-400 to-emerald-500'
        if (score >= 50) return 'bg-gradient-to-r from-amber-400 to-amber-500'
        return 'bg-gradient-to-r from-red-400 to-red-500'
    }

    return (
        <div className="glass rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-slate-900">Pillar Breakdown</h3>
            </div>

            <div className="space-y-4">
                {pillars.map((pillar) => (
                    <div key={pillar.name} className="group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700">
                                {formatName(pillar.name)}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                                {Math.round(pillar.score)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(pillar.score)}`}
                                style={{ width: `${pillar.score}%` }}
                            />
                        </div>

                        {/* Explanation on hover */}
                        <p className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {pillar.explanation}
                        </p>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
                <LegendItem color="bg-emerald-500" label="Strong (75+)" />
                <LegendItem color="bg-amber-500" label="Moderate (50-74)" />
                <LegendItem color="bg-red-500" label="Weak (<50)" />
            </div>
        </div>
    )
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs text-slate-500">{label}</span>
        </div>
    )
}
