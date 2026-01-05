import { AgencyOSSidebar } from '@/components/agency-os/AgencyOSSidebar';

export default function AgencyOSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-full">
            {/* Agency OS Sidebar */}
            <AgencyOSSidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
