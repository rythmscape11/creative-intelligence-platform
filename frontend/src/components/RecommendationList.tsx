'use client'

import { Lightbulb, ArrowUp, Wrench } from 'lucide-react'

interface Recommendation {
    priority: number
    category: string
    fix: string
    example: string
    uplift: number
    difficulty: string
}

interface RecommendationListProps {
    recommendations: Recommendation[]
}

export default function RecommendationList({ recommendations }: RecommendationListProps) {
    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'bg-emerald-100 text-emerald-700'
            case 'medium': return 'bg-amber-100 text-amber-700'
            case 'hard': return 'bg-red-100 text-red-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'visual': return '🎨'
            case 'copy': return '✍️'
            case 'layout': return '📐'
            case 'brand': return '🏷️'
            case 'cultural': return '🌏'
            case 'creative': return '💡'
            default: return '📌'
        }
    }

    return (
        <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-accent-500" />
                <h3 className="font-semibold text-slate-900">Optimization Recommendations</h3>
            </div>

            <div className="space-y-4">
                {recommendations.map((rec, index) => (
                    <div
                        key={index}
                        className="p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            {/* Priority Badge */}
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {rec.priority}
                            </div>

                            <div className="flex-1">
                                {/* Fix Text */}
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{getCategoryIcon(rec.category)}</span>
                                    <p className="font-medium text-slate-900">{rec.fix}</p>
                                </div>

                                {/* Example */}
                                <p className="text-sm text-slate-600 mb-3">{rec.example}</p>

                                {/* Meta */}
                                <div className="flex items-center gap-4">
                                    {/* Uplift */}
                                    <div className="flex items-center gap-1 text-emerald-600">
                                        <ArrowUp className="w-4 h-4" />
                                        <span className="text-sm font-medium">+{rec.uplift.toFixed(1)} pts</span>
                                    </div>

                                    {/* Difficulty */}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                                        {rec.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Impact Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-slate-900">Implement all fixes</span>
                    </div>
                    <div className="text-right">
                        <span className="text-lg font-bold text-primary-600">
                            +{recommendations.reduce((sum, r) => sum + r.uplift, 0).toFixed(1)} pts
                        </span>
                        <p className="text-xs text-slate-500">estimated uplift</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
