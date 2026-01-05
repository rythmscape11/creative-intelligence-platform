import arcjet, { tokenBucket, ArcjetNext } from "@arcjet/next";

/**
 * Arcjet Security Configuration
 * 
 * Provides:
 * 1. Rate Limiting: Token bucket (Lightweight for Vercel Free Tier)
 * 
 * Note: Shield and Bot Protection disabled to stay under 1MB Edge Function limit.
 */

let aj: ArcjetNext<any> | null = null;

if (process.env.ARCJET_KEY) {
    aj = arcjet({
        key: process.env.ARCJET_KEY,
        characteristics: ["ip.src"],
        rules: [
            // Rate Limiting for General Traffic
            tokenBucket({
                mode: "LIVE",
                refillRate: 20, // Refill 20 tokens per interval
                interval: 60,   // Interval is 60 seconds
                capacity: 50,   // Max bucket size
            }),
        ],
    });
} else {
    console.warn("⚠️ ARCJET_KEY is missing. Security features (Bot/Shield) will be DISABLED.");
}

export { aj };
