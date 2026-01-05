import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

/**
 * Sign Up Page
 * 
 * Soft Midnight themed sign-up with:
 * - Slate gradient background
 * - Frosted glass card effect
 * - Feature highlights
 */

const features = [
  'AI-powered marketing insights',
  'GEO Engine for search optimization',
  'Strategy builder & playbooks',
  'Full analytics dashboard',
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      {/* Left side - Feature highlights (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
        <div className="max-w-lg">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/brand/aureon-one-icon-gold.svg"
                  alt="Aureon One"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-[#F1F5F9]">AUREON</span>
                <span className="text-[#3B82F6] ml-1">ONE</span>
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-[#F1F5F9] leading-tight mb-6">
            Start your <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">marketing transformation</span>
          </h1>

          <p className="text-lg text-[#94A3B8] mb-8">
            Join modern marketing teams using Aureon One to unify strategy, analytics, and execution.
          </p>

          {/* Feature list */}
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                <span className="text-[#94A3B8]">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Trust badge */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-[#64748B]">
              Trusted by agencies and brands worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <div className="relative w-32 h-32">
            <Image
              src="/brand/aureon-one-logo-stacked-dark.svg"
              alt="Aureon One"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Frosted glass card */}
        <div className="w-full max-w-md">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5 overflow-hidden">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-[#F1F5F9] mb-2">Create your account</h2>
              <p className="text-[#94A3B8]">Start your free workspace today</p>
            </div>

            <SignUp
              appearance={{
                baseTheme: dark,
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 transition-all duration-300 rounded-xl",
                  socialButtonsBlockButtonText: "text-zinc-200 font-medium",
                  dividerLine: "bg-white/10",
                  dividerText: "text-zinc-500",
                  formFieldLabel: "text-zinc-400 font-medium ml-1 mb-1.5",
                  formFieldInput: "bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl transition-all h-11",
                  formButtonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/20 border-0 rounded-xl h-11 transition-all transform hover:scale-[1.01] active:scale-[0.98]",
                  footer: "bg-transparent",
                  footerActionLink: "text-blue-400 hover:text-blue-300 transition-colors",
                  footerActionText: "text-zinc-500",
                  identityPreviewText: "text-zinc-200",
                  identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
                  formFieldSuccessText: "text-emerald-400",
                  formFieldErrorText: "text-rose-400",
                  alertText: "text-zinc-400",
                  formResendCodeLink: "text-blue-400",
                }
              }}
              routing="path"
              path="/auth/signup"
              signInUrl="/auth/signin"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

