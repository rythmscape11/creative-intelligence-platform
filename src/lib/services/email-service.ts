/**
 * Email Service
 * 
 * Flexible email service that supports multiple providers:
 * - Resend (recommended for Next.js)
 * - SendGrid
 * - AWS SES
 * - Console (development)
 */

import { logger } from './logger-service';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<boolean>;
}

/**
 * Console Email Provider (Development)
 * Logs emails to console instead of sending
 */
class ConsoleEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<boolean> {
    console.log('\n=== EMAIL (DEVELOPMENT MODE) ===');
    console.log(`To: ${options.to}`);
    console.log(`From: ${options.from || 'hello@aureonone.in'}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`\n--- HTML Content ---`);
    console.log(options.html);
    if (options.text) {
      console.log(`\n--- Text Content ---`);
      console.log(options.text);
    }
    console.log('================================\n');

    logger.info('Email sent (console)', {
      to: options.to,
      subject: options.subject,
    });

    return true;
  }
}

/**
 * Resend Email Provider
 * https://resend.com
 */
class ResendEmailProvider implements EmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(options: EmailOptions): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from || 'Aureon One <hello@aureonone.in>',
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error('Resend email failed', new Error(error));
        return false;
      }

      logger.info('Email sent via Resend', {
        to: options.to,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      logger.error('Resend email error', error as Error);
      return false;
    }
  }
}

/**
 * SendGrid Email Provider
 * https://sendgrid.com
 */
class SendGridEmailProvider implements EmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(options: EmailOptions): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: options.to }],
              subject: options.subject,
            },
          ],
          from: {
            email: options.from || 'hello@aureonone.in',
            name: 'Aureon One',
          },
          content: [
            {
              type: 'text/html',
              value: options.html,
            },
            ...(options.text ? [{
              type: 'text/plain',
              value: options.text,
            }] : []),
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error('SendGrid email failed', new Error(error));
        return false;
      }

      logger.info('Email sent via SendGrid', {
        to: options.to,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      logger.error('SendGrid email error', error as Error);
      return false;
    }
  }
}

/**
 * Email Service Singleton
 */
class EmailService {
  private provider: EmailProvider;

  constructor() {
    // Determine which provider to use based on environment variables
    // Note: We trim values to handle potential trailing newlines from Vercel env vars
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const sendGridApiKey = process.env.SENDGRID_API_KEY?.trim();

    if (resendApiKey) {
      this.provider = new ResendEmailProvider(resendApiKey);
      logger.info('Email service initialized with Resend');
    } else if (sendGridApiKey) {
      this.provider = new SendGridEmailProvider(sendGridApiKey);
      logger.info('Email service initialized with SendGrid');
    } else {
      this.provider = new ConsoleEmailProvider();
      logger.info('Email service initialized with Console (development mode)');
    }
  }

  /**
   * Send an email
   */
  async send(options: EmailOptions): Promise<boolean> {
    return this.provider.send(options);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Aureon One</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            
            <p>You requested to reset your password for your Aureon One account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Reset Password</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #667eea; font-size: 14px; word-break: break-all;">${resetUrl}</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; margin-bottom: 0;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Aureon One. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
Reset Your Password

You requested to reset your password for your Aureon One account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

© ${new Date().getFullYear()} Aureon One. All rights reserved.
    `.trim();

    return this.send({
      to: email,
      subject: 'Reset Your Password - Aureon One',
      html,
      text,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();

