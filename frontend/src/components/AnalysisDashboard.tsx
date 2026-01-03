'use client';

import { AnalysisResult } from '@/types';
import ScoreCard from './ScoreCard';
import PillarChart from './PillarChart';

interface AnalysisDashboardProps {
    result: AnalysisResult;
}

export default function AnalysisDashboard({ result }: AnalysisDashboardProps) {
    if (!result.score) return null;

    return (
        <div className="mt-8 space-y-6">
            <ScoreCard data={result.score} />

            {/* Layer Summary */}
            {result.layer_summary && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-purple-200">Signal Analysis Layers</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-3xl font-bold text-blue-400 mb-1">{result.layer_summary.deterministic_signals}</p>
                            <p className="text-blue-200/60 text-xs font-medium uppercase">Deterministic</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-3xl font-bold text-purple-400 mb-1">{result.layer_summary.perceptual_signals}</p>
                            <p className="text-purple-200/60 text-xs font-medium uppercase">Perceptual</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-3xl font-bold text-pink-400 mb-1">{result.layer_summary.cognitive_signals}</p>
                            <p className="text-pink-200/60 text-xs font-medium uppercase">Cognitive</p>
                        </div>
                    </div>
                </div>
            )}

            <PillarChart pillars={result.score.pillars} />

            {/* Warnings */}
            {(result.score.warnings.length > 0 || result.score.contradictions.length > 0) && (
                <div className="bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/20 backdrop-blur-md">
                    <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                        <span>⚠️</span> Warnings & Contradictions
                    </h3>
                    <ul className="space-y-2">
                        {result.score.warnings.map((w, i) => (
                            <li key={i} className="text-yellow-200/80 text-sm flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>{w}</span>
                            </li>
                        ))}
                        {result.score.contradictions.map((c, i) => (
                            <li key={`c-${i}`} className="text-orange-300/80 text-sm flex items-start gap-2">
                                <span className="mt-1">•</span>
                                <span>{c}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Processing Time</p>
                    <p className="text-white text-xl font-mono">{result.processing_time_ms}ms</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Tokens Used</p>
                    <p className="text-white text-xl font-mono">{result.total_tokens_used?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
