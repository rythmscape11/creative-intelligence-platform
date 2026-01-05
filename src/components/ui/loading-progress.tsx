"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface Step {
    id: number;
    label: string;
}

interface LoadingProgressProps {
    steps: string[];
    currentStepIndex: number; // 0 to steps.length - 1
    progress: number; // 0 to 100
}

export function LoadingProgress({ steps, currentStepIndex, progress }: LoadingProgressProps) {
    return (
        <div className="w-full max-w-md mx-auto p-6 bg-background/50 backdrop-blur-sm border border-border rounded-xl shadow-lg">
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Analyzing Market Data...</h3>
                    <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isPending = index > currentStepIndex;

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isCurrent ? 'bg-primary/10' : ''
                                }`}
                        >
                            <div className="flex-shrink-0">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : isCurrent ? (
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-muted" />
                                )}
                            </div>
                            <span
                                className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                                    }`}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
