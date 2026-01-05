/**
 * Email Service
 * 
 * Resend client for sending transactional emails.
 */

import { Resend } from 'resend';

/**
 * Resend client instance
 * Note: We trim the API key to handle potential trailing newlines from Vercel env vars
 */
const resendApiKey = (process.env.RESEND_API_KEY || 're_placeholder').trim();

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY is not set. Email features will not work until configured.');
}

export const resend = new Resend(resendApiKey);

/**
 * Email configuration
 * Note: We trim all values to handle potential trailing newlines from Vercel env vars
 */
export const EMAIL_CONFIG = {
  // Use onboarding@resend.dev for testing, or your verified domain
  from: (process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev').trim(),
  fromName: (process.env.RESEND_FROM_NAME || 'MediaPlanPro').trim(),
  replyTo: (process.env.RESEND_REPLY_TO_EMAIL || 'hello@aureonone.in').trim(),
} as const;

/**
 * Email templates
 */
export const EMAIL_SUBJECTS = {
  WELCOME: 'Welcome to MediaPlanPro! 🎉',
  PURCHASE_CONFIRMATION: 'Your MediaPlanPro Subscription is Active',
  SUBSCRIPTION_RENEWAL: 'Your MediaPlanPro Subscription Renews Soon',
  PAYMENT_FAILED: 'Payment Failed - Action Required',
  SUBSCRIPTION_CANCELED: 'Your MediaPlanPro Subscription Has Been Canceled',
  TRIAL_ENDING: 'Your MediaPlanPro Trial Ends Soon',
} as const;

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping welcome email (RESEND_API_KEY not configured)');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to,
      subject: EMAIL_SUBJECTS.WELCOME,
      html: getWelcomeEmailHTML(name),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return null;
  }
}

/**
 * Send purchase confirmation email
 */
export async function sendPurchaseConfirmationEmail(
  to: string,
  name: string,
  plan: string,
  amount: number,
  invoiceUrl?: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping purchase confirmation email (RESEND_API_KEY not configured)');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to,
      subject: EMAIL_SUBJECTS.PURCHASE_CONFIRMATION,
      html: getPurchaseConfirmationEmailHTML(name, plan, amount, invoiceUrl),
    });

    if (error) {
      console.error('Error sending purchase confirmation email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return null;
  }
}

/**
 * Send subscription renewal reminder
 */
export async function sendSubscriptionRenewalEmail(
  to: string,
  name: string,
  plan: string,
  renewalDate: Date,
  amount: number
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping renewal reminder email (RESEND_API_KEY not configured)');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to,
      subject: EMAIL_SUBJECTS.SUBSCRIPTION_RENEWAL,
      html: getSubscriptionRenewalEmailHTML(name, plan, renewalDate, amount),
    });

    if (error) {
      console.error('Error sending renewal reminder email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending renewal reminder email:', error);
    return null;
  }
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(
  to: string,
  name: string,
  plan: string,
  amount: number,
  retryDate?: Date
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping payment failed email (RESEND_API_KEY not configured)');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to,
      subject: EMAIL_SUBJECTS.PAYMENT_FAILED,
      html: getPaymentFailedEmailHTML(name, plan, amount, retryDate),
    });

    if (error) {
      console.error('Error sending payment failed email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending payment failed email:', error);
    return null;
  }
}

/**
 * Send subscription canceled email
 */
export async function sendSubscriptionCanceledEmail(
  to: string,
  name: string,
  plan: string,
  endDate: Date
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping subscription canceled email (RESEND_API_KEY not configured)');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to,
      subject: EMAIL_SUBJECTS.SUBSCRIPTION_CANCELED,
      html: getSubscriptionCanceledEmailHTML(name, plan, endDate),
    });

    if (error) {
      console.error('Error sending subscription canceled email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending subscription canceled email:', error);
    return null;
  }
}

// Email HTML templates
function getWelcomeEmailHTML(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MediaPlanPro</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MediaPlanPro! 🎉</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for subscribing to MediaPlanPro Professional! We're excited to have you on board.
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            You now have access to all our premium features:
          </p>
          
          <ul style="font-size: 16px; margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 10px;">✓ Unlimited marketing strategies</li>
            <li style="margin-bottom: 10px;">✓ Advanced AI assistance</li>
            <li style="margin-bottom: 10px;">✓ All export formats (PDF, PowerPoint, Excel)</li>
            <li style="margin-bottom: 10px;">✓ Priority support</li>
            <li style="margin-bottom: 10px;">✓ Team collaboration tools</li>
            <li style="margin-bottom: 10px;">✓ Analytics dashboard</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/strategies/create" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Create Your First Strategy
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #667eea;">Help Center</a>.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} MediaPlanPro. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

function getPurchaseConfirmationEmailHTML(name: string, plan: string, amount: number, invoiceUrl?: string): string {
  const formattedAmount = (amount / 100).toFixed(2);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Purchase Confirmation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10b981; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Successful ✓</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Your payment has been processed successfully. Your ${plan} subscription is now active!
          </p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Plan:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${plan}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Amount:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">$${formattedAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          ${invoiceUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invoiceUrl}" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Download Invoice
            </a>
          </div>
          ` : ''}
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            You can manage your subscription anytime from your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" style="color: #667eea;">billing dashboard</a>.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} MediaPlanPro. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

function getSubscriptionRenewalEmailHTML(name: string, plan: string, renewalDate: Date, amount: number): string {
  const formattedAmount = (amount / 100).toFixed(2);
  const formattedDate = renewalDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Renewal</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #F59E0B; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Subscription Renewal Reminder</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Your ${plan} subscription will automatically renew on <strong>${formattedDate}</strong>.
          </p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">Renewal Amount:</p>
            <p style="font-size: 24px; font-weight: 700; margin: 0; color: #1f2937;">$${formattedAmount}</p>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            No action is required. We'll automatically charge your payment method on file.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Manage Subscription
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Want to make changes? You can update your payment method or cancel anytime from your billing dashboard.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} MediaPlanPro. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

function getPaymentFailedEmailHTML(name: string, plan: string, amount: number, retryDate?: Date): string {
  const formattedAmount = (amount / 100).toFixed(2);
  const retryInfo = retryDate
    ? `We'll automatically retry the payment on ${retryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`
    : 'Please update your payment method to continue your subscription.';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Failed</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ef4444; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Failed</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            We were unable to process your payment for your ${plan} subscription.
          </p>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 30px 0;">
            <p style="font-size: 14px; color: #991b1b; margin: 0 0 10px 0; font-weight: 600;">Action Required</p>
            <p style="font-size: 14px; color: #7f1d1d; margin: 0;">
              Amount: $${formattedAmount}<br>
              ${retryInfo}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" style="background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Update Payment Method
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            If you have questions about this charge, please contact our support team.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} MediaPlanPro. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

function getSubscriptionCanceledEmailHTML(name: string, plan: string, endDate: Date): string {
  const formattedDate = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Canceled</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #6b7280; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Subscription Canceled</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            We're sorry to see you go! Your ${plan} subscription has been canceled.
          </p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 10px 0;">Access Until:</p>
            <p style="font-size: 20px; font-weight: 700; margin: 0; color: #1f2937;">${formattedDate}</p>
            <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">
              You'll continue to have access to all premium features until this date.
            </p>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            We'd love to have you back! You can reactivate your subscription anytime.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Reactivate Subscription
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Have feedback? We'd love to hear from you. Reply to this email to let us know how we can improve.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} MediaPlanPro. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send product delivery email
 */
export async function sendProductDeliveryEmail(
  to: string,
  productName: string,
  downloadLink: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping product delivery email (RESEND_API_KEY not configured)');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to,
      subject: `Your Order: ${productName}`,
      html: getProductDeliveryEmailHTML(productName, downloadLink),
    });

    if (error) {
      console.error('Error sending product delivery email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error sending product delivery email:', error);
    return null;
  }
}

function getProductDeliveryEmailHTML(productName: string, downloadLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10b981; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi there,</p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Here is your access link for <strong>${productName}</strong>.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${downloadLink}" style="background: #10b981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 18px;">
              Access Your Framework
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 30px;">
            Or copy this link: <br>
            <a href="${downloadLink}" style="color: #667eea;">${downloadLink}</a>
          </p>

          <p style="font-size: 16px; margin-bottom: 20px;">
            <strong>Important:</strong> Please save your files locally.
          </p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Need help? Reply to this email properly.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} AureonOne. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}

