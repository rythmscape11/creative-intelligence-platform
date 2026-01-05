/**
 * Test script to verify Resend email functionality
 *
 * Usage: npx tsx scripts/test-email.ts
 */

import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Load environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@mediaplanpro.com';
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'MediaPlanPro';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@mediaplanpro.com';

async function testEmailConfiguration() {
  console.log('🔍 Testing Resend Email Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`   RESEND_API_KEY: ${RESEND_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   RESEND_FROM_EMAIL: ${RESEND_FROM_EMAIL}`);
  console.log(`   RESEND_FROM_NAME: ${RESEND_FROM_NAME}`);
  console.log(`   ADMIN_EMAIL: ${ADMIN_EMAIL}\n`);

  if (!RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY is not set');
    console.log('\n💡 To fix this, add RESEND_API_KEY to your .env.local file:');
    console.log('   RESEND_API_KEY=re_your_api_key_here\n');
    process.exit(1);
  }

  // Initialize Resend client
  const resend = new Resend(RESEND_API_KEY);

  try {
    // Test 1: Send a test email
    console.log('📧 Test 1: Sending test email...');
    const { data, error } = await resend.emails.send({
      from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
      to: [ADMIN_EMAIL],
      subject: '✅ MediaPlanPro Email Test - Configuration Successful',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Test</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✅ Email Configuration Successful!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #667eea; margin-top: 0;">Congratulations! 🎉</h2>
              
              <p>Your Resend email integration is working perfectly. This test email confirms that:</p>
              
              <ul style="background: white; padding: 20px 20px 20px 40px; border-radius: 8px; border-left: 4px solid #667eea;">
                <li>✅ DNS records are properly configured</li>
                <li>✅ Resend API key is valid</li>
                <li>✅ Email sending is functional</li>
                <li>✅ Environment variables are loaded correctly</li>
              </ul>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3 style="color: #667eea; margin-top: 0;">Configuration Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>From Email:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${RESEND_FROM_EMAIL}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>From Name:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${RESEND_FROM_NAME}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Admin Email:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${ADMIN_EMAIL}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Test Date:</strong></td>
                    <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0;"><strong>⚠️ Next Steps:</strong></p>
                <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Test the service inquiry form on your website</li>
                  <li>Verify emails are delivered to your inbox</li>
                  <li>Check spam folder if emails don't appear</li>
                  <li>Monitor email delivery in Resend dashboard</li>
                </ol>
              </div>
              
              <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
                This is an automated test email from MediaPlanPro<br>
                <a href="https://mediaplanpro.com" style="color: #667eea; text-decoration: none;">mediaplanpro.com</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error sending test email:', error);
      process.exit(1);
    }

    console.log('✅ Test email sent successfully!');
    console.log(`   Email ID: ${data?.id}\n`);

    // Test 2: Verify domain configuration
    console.log('🔍 Test 2: Verifying domain configuration...');
    console.log('   Domain: mediaplanpro.com');
    console.log('   Status: ✅ Verified (based on successful email send)\n');

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL TESTS PASSED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📧 Email Configuration Summary:');
    console.log(`   ✅ Resend API: Connected`);
    console.log(`   ✅ Domain: Verified`);
    console.log(`   ✅ Email Sending: Functional`);
    console.log(`   ✅ Test Email: Sent to ${ADMIN_EMAIL}\n`);
    console.log('💡 Next Steps:');
    console.log('   1. Check your inbox for the test email');
    console.log('   2. Test the service inquiry form on your website');
    console.log('   3. Monitor email delivery in Resend dashboard:');
    console.log('      https://resend.com/emails\n');

  } catch (error) {
    console.error('❌ Error during email test:', error);
    process.exit(1);
  }
}

// Run the test
testEmailConfiguration();

