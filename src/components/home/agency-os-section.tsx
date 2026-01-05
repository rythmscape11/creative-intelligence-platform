'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Users,
    Layers,
    CheckSquare,
    BarChart3,
    ArrowRight,
    Shield,
    FolderKanban,
    CalendarClock,
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        name: 'Client Workspaces',
        description: 'Dedicated workspaces per client with permissions, ownership, and audit trails.',
        icon: Users,
        color: 'bg-zinc-700',
    },
    {
        name: 'Campaign Projects',
        description: 'Structure campaigns as projects with status tracking, timelines, and assignments.',
        icon: Layers,
        color: 'bg-zinc-800',
    },
    {
        name: 'Deliverables',
        description: 'Track tasks and deliverables with priorities, deadlines, and accountability.',
        icon: CheckSquare,
        color: 'bg-zinc-700',
    },
    {
        name: 'Cycles & Sprints',
        description: 'Run time-boxed phases for predictable delivery and progress visibility.',
        icon: CalendarClock,
        color: 'bg-zinc-800',
    },
    {
        name: 'Kanban & Views',
        description: 'Flexible views—Kanban, list, calendar—to match how your team works.',
        icon: FolderKanban,
        color: 'bg-zinc-700',
    },
    {
        name: 'Activity & Audit',
        description: 'Full activity logs, version history, and role-based access control.',
        icon: Shield,
        color: 'bg-zinc-800',
    },
    {
        name: 'Progress Tracking',
        description: 'Real-time status on campaigns, deliverables, and team workload.',
        icon: BarChart3,
        color: 'bg-zinc-700',
    },
    {
        name: 'Stable Infrastructure',
        description: 'Built on proven open-source foundations for enterprise reliability.',
        icon: Shield,
        color: 'bg-zinc-800',
    },
];

export function AgencyOSSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-zinc-950 dark:bg-black text-white">
            {/* Subtle Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-20 w-72 h-72 bg-zinc-800/30 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-sm font-medium mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2" />
                        Agency Operating System
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Stable Operations,{' '}
                        <span className="text-zinc-400">Built for Agencies</span>
                    </h2>

                    <p className="text-xl text-zinc-400 leading-relaxed">
                        A structured operating system for modern marketing agencies.
                        Manage clients, campaigns, and deliverables with enterprise-grade reliability.
                    </p>
                </div>

                {/* Feature Grid - 4x2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600 transition-all hover:bg-zinc-900 duration-300"
                        >
                            <div className={`h-10 w-10 rounded-lg ${feature.color} flex items-center justify-center mb-3 border border-zinc-600`}>
                                <feature.icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{feature.name}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/agency">
                        <Button size="lg" className="rounded-full bg-white text-black hover:bg-zinc-200 px-8 text-lg h-12">
                            Launch Agency OS
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/product/agency-os">
                        <Button variant="outline" size="lg" className="rounded-full border-zinc-700 text-white hover:bg-zinc-800 text-lg h-12">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
