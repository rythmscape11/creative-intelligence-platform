'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Breadcrumbs } from './breadcrumbs';
import { BackButton } from './back-button';

interface PageWrapperProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showBreadcrumbs?: boolean;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonLabel?: string;
  className?: string;
  containerClassName?: string;
}

export function PageWrapper({
  children,
  showHeader = true,
  showFooter = true,
  showBreadcrumbs = false,
  showBackButton = false,
  backButtonHref,
  backButtonLabel,
  className = '',
  containerClassName = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
}: PageWrapperProps) {
  return (
    <div className={`min-h-screen bg-gradient-mesh ${className}`}>
      {showHeader && <Header />}
      
      <main id="main-content" className={`py-8 ${containerClassName}`}>
        {(showBreadcrumbs || showBackButton) && (
          <div className="mb-6 flex items-center justify-between">
            {showBreadcrumbs && <Breadcrumbs />}
            {showBackButton && (
              <BackButton 
                href={backButtonHref} 
                label={backButtonLabel}
                className="ml-auto"
              />
            )}
          </div>
        )}
        
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

