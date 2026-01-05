'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugRolePage() {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) return <div className="p-8">Loading...</div>;
    if (!isSignedIn) return <div className="p-8">Not signed in.</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>User Role Debugger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-bold">User ID:</h3>
                        <code className="bg-muted p-1 rounded">{user.id}</code>
                    </div>
                    <div>
                        <h3 className="font-bold">Email:</h3>
                        <code className="bg-muted p-1 rounded">{user.primaryEmailAddress?.emailAddress}</code>
                    </div>
                    <div>
                        <h3 className="font-bold">Public Metadata (Role):</h3>
                        <pre className="bg-muted p-2 rounded overflow-auto">
                            {JSON.stringify(user.publicMetadata, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <h3 className="font-bold">Unsafe Metadata:</h3>
                        <pre className="bg-muted p-2 rounded overflow-auto">
                            {JSON.stringify(user.unsafeMetadata, null, 2)}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
