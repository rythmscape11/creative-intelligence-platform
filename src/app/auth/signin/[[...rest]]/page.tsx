import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

/**
 * Catch-all route for Clerk SignIn sub-routes
 * Handles: /auth/signin/factor-one, /auth/signin/factor-two, /auth/signin/sso-callback, etc.
 */
export default function SignInCatchAll() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
            <div className="w-full max-w-md">
                <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5 overflow-hidden">
                    <SignIn
                        appearance={{
                            baseTheme: dark,
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none p-0",
                                headerTitle: "text-white text-xl font-semibold",
                                headerSubtitle: "text-zinc-400",
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
                                otpCodeFieldInput: "bg-black/40 border border-white/10 text-white focus:border-blue-500/50 rounded-lg",
                            }
                        }}
                        routing="path"
                        path="/auth/signin"
                        signUpUrl="/auth/signup"
                    />
                </div>
            </div>
        </div>
    );
}
