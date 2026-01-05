import { ReactNode } from 'react';
import { ForgeSidebar } from '@/components/forge/ForgeSidebar';

export default function ForgeLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#0F172A]">
            {/* Forge sub-navigation */}
            <aside className="hidden lg:block w-[220px] border-r border-white/5 bg-[#1E293B]">
                <ForgeSidebar />
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}

