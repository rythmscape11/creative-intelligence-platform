import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/services/logger-service';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = resetPasswordSchema.parse(body);
    const { email, token, password } = validatedData;

    // Hash the provided token to compare with stored hash
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching email and valid reset token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: resetTokenHash,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      logger.warn('Invalid or expired password reset token', { email });
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    logger.info('Password reset successful', { userId: user.id, email });

    // Log user activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET',
        entityType: 'USER',
        entityId: user.id,
        details: JSON.stringify({ email }),
        timestamp: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: 'Password has been reset successfully. You can now sign in with your new password.',
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

    logger.error('Reset password error', error as Error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

