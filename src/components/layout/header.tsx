'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { GlobalSearch, useGlobalSearch } from '@/components/search/global-search';

/**
 * Aureon One Header
 * 
 * Sticky navigation with orbit logo and nav links.
 */

// Navigation links matching Aureon One spec
const navigation = [
  { name: 'Product', href: '/product' },
  { name: 'Frameworks', href: '/frameworks' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Free Tools', href: '/tools' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Resources', href: '/resources' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const globalSearch = useGlobalSearch();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isAuthenticated = isLoaded && isSignedIn;
  const isAuthPage = pathname?.startsWith('/auth');

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('[Auth] Sign out failed', error);
      window.location.href = '/';
    }
  };

  const handleMobileSignOut = async () => {
    setMobileMenuOpen(false);
    await handleSignOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group transition-all duration-300 ease-out hover:opacity-90">
              <div className="relative h-10 w-[180px] transition-transform duration-300 ease-out group-hover:scale-105">
                <Image
                  src="/brand/aureon-one-logo-horizontal-dark.svg"
                  alt="Aureon One"
                  fill
                  priority
                  className="object-contain object-left"
                  data-testid="header-logo"
                />
              </div>
            </Link>
          </div>


          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {!isLoaded ? (
              <div className="h-10 w-24 rounded-full animate-pulse bg-white/10" />
            ) : isAuthenticated && !isAuthPage ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all text-white bg-white/10 hover:bg-white/20"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  disabled={isSigningOut}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
                >
                  Sign in
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-6 rounded-lg shadow-lg shadow-[#3B82F6]/25">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-[#3B82F6] p-2.5 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0F172A] border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
            <div className="py-3 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-3 mt-3 px-2">
                {isAuthenticated && !isAuthPage ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-base font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleMobileSignOut}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-60"
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2.5 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-2.5 text-base font-medium bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded-md mx-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={globalSearch.isOpen} onClose={globalSearch.close} />
    </header>
  );
}
