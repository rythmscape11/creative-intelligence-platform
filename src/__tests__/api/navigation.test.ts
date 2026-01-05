import { GET } from '@/app/api/navigation/route';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { describe, it, expect, vi, Mock } from 'vitest';

vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}));

describe('Navigation API', () => {
    it('returns 401 if not authenticated', async () => {
        (auth as Mock).mockReturnValue({ userId: null });
        const response = await GET();
        expect(response.status).toBe(401);
    });

    it('returns user navigation for USER role', async () => {
        (auth as Mock).mockReturnValue({
            userId: 'user_123',
            sessionClaims: { metadata: { role: 'USER' } },
        });
        const response = await GET();
        const data = await response.json();

        expect(data.primary).toBeDefined();
        expect(data.primary.find((i: any) => i.name === 'Admin Panel')).toBeUndefined();
    });

    it('returns admin navigation for ADMIN role', async () => {
        (auth as Mock).mockReturnValue({
            userId: 'admin_123',
            sessionClaims: { metadata: { role: 'ADMIN' } },
        });
        const response = await GET();
        const data = await response.json();

        expect(data.primary.find((i: any) => i.name === 'Admin Panel')).toBeDefined();
    });
});
