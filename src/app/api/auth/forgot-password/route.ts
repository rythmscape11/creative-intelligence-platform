import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { passwordResetRateLimiter, getClientIP } from '@/lib/rate-limiters';
import { logger } from '@/lib/services/logger-service';
import { emailService } from '@/lib/services/email-service';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = getClientIP(request);
    const { allowed, remaining, resetAt } = passwordResetRateLimiter.check(clientIP);
    
    if (!allowed) {
      logger.warn('Password reset rate limit exceeded', { ip: clientIP });
      return NextResponse.json(
        { message: 'Too many password reset attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetAt).toISOString(),
            'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      
      // Token expires in 1 hour
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

      // Store reset token in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: resetTokenHash,
          resetTokenExpiry,
        },
      });

      // Create reset URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      // Send password reset email
      const emailSent = await emailService.sendPasswordResetEmail(email, resetUrl);

      if (!emailSent) {
        logger.error('Failed to send password reset email', new Error(`Email: ${email}`));
        // Don't reveal to user that email failed - security best practice
      }

      logger.info('Password reset email sent', { email });
    } else {
      // User doesn't exist, but don't reveal this
      logger.warn('Password reset requested for non-existent email', { email });
    }

    // Always return success message
    return NextResponse.json(
      {
        message: 'If an account exists with that email, you will receive a password reset link shortly.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    logger.error('Forgot password error', error as Error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

