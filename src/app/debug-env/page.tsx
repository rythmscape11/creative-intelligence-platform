export const dynamic = 'force-dynamic';

export default function DebugEnvPage() {
    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Environment Debug (Recreated)</h1>
            <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(
                    {
                        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
                        VERCEL_URL: process.env.VERCEL_URL,
                        NODE_ENV: process.env.NODE_ENV,
                        // Check if trim worked by checking length or explicit characters
                        NEXTAUTH_URL_LENGTH: process.env.NEXTAUTH_URL?.length,
                        NEXT_PUBLIC_APP_URL_LENGTH: process.env.NEXT_PUBLIC_APP_URL?.length,
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    );
}
