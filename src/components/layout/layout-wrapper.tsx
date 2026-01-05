'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';

/**
 * LayoutWrapper - Conditionally renders Header and Footer
 * 
 * Automatically adds Header/Footer to all pages EXCEPT:
 * - Dashboard pages (have DashboardHeader + Footer)
 * - Admin pages (have custom admin header + footer)
 */
export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Exclude header/footer for dashboard and admin routes (they have their own)
    const excludeLayout = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

    if (excludeLayout) {
        return <>{children}</>;
    }

    // All other pages get Header + Footer
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
