import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/types';
import { syncContactToMailchimp } from '@/lib/mailchimp';
import { decrypt } from '@/lib/encryption';

import { clerkClient } from '@clerk/nextjs/server';
import { isDisposableEmail } from '@/lib/disposable-email';

export async function POST(req: Request) {
    console.log('[Clerk Webhook] Received webhook request');

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error('[Clerk Webhook] CLERK_WEBHOOK_SECRET not configured!');
        throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', {
            status: 400,
        });
    }

    // Handle the webhook
    const eventType = evt.type;
    console.log(`[Clerk Webhook] Processing event: ${eventType}`);

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;
        const email = email_addresses[0].email_address;

        // 1. Check for Disposable Email
        if (isDisposableEmail(email)) {
            console.warn(`[Clerk Webhook] BLOCKED disposable email registration: ${email}`);

            // Attempt to delete the user from Clerk to prevent them from signing in
            try {
                const client = await clerkClient();
                await client.users.deleteUser(id);
                console.log(`[Clerk Webhook] Deleted user ${id} from Clerk due to disposable email.`);
            } catch (clerkError) {
                console.error('[Clerk Webhook] Failed to delete user from Clerk:', clerkError);
            }

            // Return success to Clerk so it stops retrying the webhook
            // We successfully processed it by blocking it.
            return new Response('Blocked disposable email', { status: 200 });
        }

        try {
            // Check if user exists by email
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // User exists! We need to migrate them to the new Clerk ID.
                // We update the 'id' field. Prisma/Postgres should cascade this change to related tables
                // if foreign keys are configured with ON UPDATE CASCADE (which is default for Prisma relations).
                console.log(`[Clerk Webhook] Migrating existing user ${email} to Clerk ID ${id}`);
                await prisma.user.update({
                    where: { email },
                    data: {
                        id: id, // MIGRATE THE ID to match Clerk
                        clerkId: id,
                        name: `${first_name || ''} ${last_name || ''}`.trim() || email,
                        role: (public_metadata?.role as UserRole) || existingUser.role,
                    },
                });
            } else {
                // Create new user
                await prisma.user.create({
                    data: {
                        id,
                        clerkId: id,
                        email,
                        name: `${first_name || ''} ${last_name || ''}`.trim() || email,
                        password: '', // Not used with Clerk
                        role: (public_metadata?.role as UserRole) || 'USER',
                    },
                });
            }

            console.log(`[Clerk Webhook] User created/migrated: ${email}`);

            // Sync to Mailchimp if it's a new user creation (not migration)
            if (!existingUser) {
                // 1. Create 60-day Free Trial Subscription
                try {
                    const trialEndDate = new Date();
                    trialEndDate.setDate(trialEndDate.getDate() + 60); // 60 days from now

                    await prisma.subscription.create({
                        data: {
                            userId: id,
                            plan: 'PRO', // Give them PRO features
                            status: 'TRIALING',
                            trialStart: new Date(),
                            trialEnd: trialEndDate,
                            paymentGateway: 'razorpay', // Default to Razorpay for now
                        },
                    });
                    console.log(`[Clerk Webhook] Assigned 60-day PRO trial to user ${email}`);
                } catch (subError) {
                    console.error('[Clerk Webhook] Failed to create trial subscription:', subError);
                    // Continue execution, don't fail webhook
                }

                // 2. Sync to Mailchimp
                try {
                    const integration = await prisma.integration.findFirst({
                        where: {
                            type: 'MAILCHIMP',
                            isActive: true,
                            status: 'ACTIVE',
                        },
                    });

                    if (integration && integration.apiKey && integration.serverPrefix) {
                        const settings = integration.settings as any;
                        const audienceId = settings?.defaultAudienceId || settings?.audienceId;

                        if (audienceId) {
                            await syncContactToMailchimp(
                                {
                                    apiKey: decrypt(integration.apiKey),
                                    serverPrefix: integration.serverPrefix,
                                },
                                audienceId,
                                {
                                    email,
                                    firstName: first_name || '',
                                    lastName: last_name || '',
                                },
                                ['New User', 'Registered', 'Trial User']
                            );
                            console.log(`[Clerk Webhook] Synced user ${email} to Mailchimp`);
                        }
                    }
                } catch (mcError) {
                    console.error('[Clerk Webhook] Failed to sync to Mailchimp:', mcError);
                    // Don't fail the webhook for this
                }
            }
        } catch (error) {
            console.error('[Clerk Webhook] Error creating/migrating user:', error);
            console.error('[Clerk Webhook] Error details:', JSON.stringify(error, null, 2));
            return new Response('Error creating/migrating user', { status: 500 });
        }
    }

    if (eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, public_metadata, image_url } = evt.data;

        try {
            // Prepare update payload
            const updatePayload = {
                name: `${first_name || ''} ${last_name || ''}`.trim() || email_addresses[0].email_address,
                avatar: image_url || undefined,
            };

            // Validate payload matches our core user update rules (e.g. non-empty names if required by config)
            // Note: We don't strictly enforce schema on webhook ingestion to avoid breaking sync if external data is messy,
            // but we use the type to ensure we are mapping to valid fields.

            await prisma.user.update({
                where: { id },
                data: {
                    email: email_addresses[0].email_address,
                    name: updatePayload.name,
                    role: (public_metadata?.role as UserRole) || 'USER',
                    avatar: updatePayload.avatar
                },
            });

            console.log(`[Clerk Webhook] User updated: ${email_addresses[0].email_address}`);
        } catch (error) {
            console.error('[Clerk Webhook] Error updating user:', error);
            // Don't fail if user doesn't exist yet
            return new Response('OK', { status: 200 });
        }
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        try {
            await prisma.user.delete({
                where: { id },
            });

            console.log(`[Clerk Webhook] User deleted: ${id}`);
        } catch (error) {
            console.error('[Clerk Webhook] Error deleting user:', error);
            // Don't fail if user doesn't exist
            return new Response('OK', { status: 200 });
        }
    }

    return new Response('Webhook processed successfully', { status: 200 });
}
