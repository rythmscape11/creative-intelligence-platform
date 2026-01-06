/**
 * OpenAPI Spec Generator
 * 
 * Generates OpenAPI 3.0 specification from Zod DTOs
 * Run: npx ts-node --project tsconfig.json scripts/generate-openapi.ts
 */

import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z);

// Import DTOs (note: this script runs outside Next.js, so we use relative paths)
// In production, you'd import from @/dtos or adjust the paths

const registry = new OpenAPIRegistry();

// --- Register Auth Schemas ---

const RegisterRequestSchema = z.object({
    email: z.string().email().openapi({ example: 'user@example.com' }),
    password: z.string().min(8).openapi({ example: 'securePassword123' }),
    name: z.string().min(1).openapi({ example: 'John Doe' }),
}).openapi('RegisterRequest');

const LoginRequestSchema = z.object({
    email: z.string().email().openapi({ example: 'user@example.com' }),
    password: z.string().openapi({ example: 'securePassword123' }),
}).openapi('LoginRequest');

registry.register('RegisterRequest', RegisterRequestSchema);
registry.register('LoginRequest', LoginRequestSchema);

// --- Register Subscription Schemas ---

const SubscriptionPlanSchema = z.enum(['FREE', 'PRO', 'AGENCY', 'TEAM', 'ENTERPRISE']).openapi('SubscriptionPlan');
const SubscriptionStatusSchema = z.enum(['ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'UNPAID']).openapi('SubscriptionStatus');

const SubscriptionResponseSchema = z.object({
    id: z.string().optional(),
    plan: SubscriptionPlanSchema,
    status: SubscriptionStatusSchema,
    cancelAtPeriodEnd: z.boolean(),
    currentPeriodEnd: z.string().datetime().nullable().optional(),
    trialEnd: z.string().datetime().nullable().optional(),
}).openapi('SubscriptionResponse');

registry.register('SubscriptionPlan', SubscriptionPlanSchema);
registry.register('SubscriptionStatus', SubscriptionStatusSchema);
registry.register('SubscriptionResponse', SubscriptionResponseSchema);

// --- Register Contact Schemas ---

const ContactFormRequestSchema = z.object({
    name: z.string().min(1).openapi({ example: 'John Doe' }),
    email: z.string().email().openapi({ example: 'john@example.com' }),
    company: z.string().optional().openapi({ example: 'Acme Inc' }),
    message: z.string().min(10).openapi({ example: 'I would like to learn more about your services.' }),
}).openapi('ContactFormRequest');

registry.register('ContactFormRequest', ContactFormRequestSchema);

// --- Register API Paths ---

registry.registerPath({
    method: 'post',
    path: '/api/auth/register',
    summary: 'Register a new user',
    tags: ['Auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: RegisterRequestSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'User registered successfully',
        },
        400: {
            description: 'Validation error',
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/api/subscription',
    summary: 'Get current user subscription',
    tags: ['Subscription'],
    responses: {
        200: {
            description: 'Subscription details',
            content: {
                'application/json': {
                    schema: z.object({
                        subscription: SubscriptionResponseSchema,
                    }),
                },
            },
        },
        401: {
            description: 'Unauthorized',
        },
    },
});

registry.registerPath({
    method: 'post',
    path: '/api/contact',
    summary: 'Submit a contact form',
    tags: ['Contact'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: ContactFormRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Message sent successfully',
        },
        400: {
            description: 'Validation error',
        },
    },
});

// --- Generate OpenAPI Spec ---

const generator = new OpenApiGeneratorV3(registry.definitions);

const spec = generator.generateDocument({
    openapi: '3.0.3',
    info: {
        title: 'Aureon One API',
        version: '1.0.0',
        description: 'API documentation for the Aureon One platform - AI-powered marketing intelligence.',
        contact: {
            name: 'API Support',
            email: 'support@aureonone.com',
        },
    },
    servers: [
        {
            url: 'https://aureonone.com',
            description: 'Production server',
        },
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Subscription', description: 'Subscription and billing' },
        { name: 'Contact', description: 'Contact and lead capture' },
        { name: 'Strategy', description: 'AI strategy generation' },
        { name: 'Blog', description: 'Blog CMS operations' },
    ],
});

// Write to file
const outputPath = path.join(__dirname, '..', 'docs', 'openapi.json');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
console.log(`✅ OpenAPI spec generated: ${outputPath}`);

// Also export for programmatic use
export { spec, registry };
