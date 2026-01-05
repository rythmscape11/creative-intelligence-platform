/**
 * Email Templates for Aureon One
 * 
 * Professional HTML email templates matching the Aureon One dark theme
 */

export interface AdminNotificationData {
  leadType: 'contact' | 'service_inquiry' | 'newsletter';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  hearAboutUs?: string;
  submittedAt: string;
  dashboardLink?: string;
}

export interface AutoResponseData {
  name: string;
  serviceInterest?: string;
}

/**
 * Admin Notification Email Template
 * Sent to hello@aureonone.com when a new lead is submitted
 */
export function getAdminNotificationEmail(data: AdminNotificationData): { subject: string; html: string; text: string } {
  const subject = `🎯 New Lead: ${data.serviceInterest || 'Contact Form'} - ${data.company || data.name}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272A 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 24px; font-weight: bold;">
                🎯 New Lead Received!
              </h1>
              <p style="margin: 10px 0 0 0; color: #000000; opacity: 0.9; font-size: 14px;">
                ${data.submittedAt}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Lead Type Badge -->
              <div style="margin-bottom: 20px;">
                <span style="display: inline-block; background-color: #3B82F6; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                  ${data.leadType.replace('_', ' ')}
                </span>
              </div>

              <!-- Contact Information -->
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; font-weight: 600; border-bottom: 2px solid #18181B; padding-bottom: 10px;">
                Contact Information
              </h2>
              
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600; width: 140px;">Name:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600;">Email:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">
                    <a href="mailto:${data.email}" style="color: #3B82F6; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                ${data.phone ? `
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600;">Phone:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">
                    <a href="tel:${data.phone}" style="color: #3B82F6; text-decoration: none;">${data.phone}</a>
                  </td>
                </tr>
                ` : ''}
                ${data.company ? `
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600;">Company:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">${data.company}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Inquiry Details -->
              ${data.serviceInterest || data.budget || data.timeline ? `
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; font-weight: 600; border-bottom: 2px solid #18181B; padding-bottom: 10px;">
                Inquiry Details
              </h2>
              
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                ${data.serviceInterest ? `
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600; width: 140px;">Service Interest:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">${data.serviceInterest}</td>
                </tr>
                ` : ''}
                ${data.budget ? `
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600;">Budget:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">${data.budget}</td>
                </tr>
                ` : ''}
                ${data.timeline ? `
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600;">Timeline:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">${data.timeline}</td>
                </tr>
                ` : ''}
                ${data.hearAboutUs ? `
                <tr>
                  <td style="color: #666666; font-size: 14px; font-weight: 600;">Source:</td>
                  <td style="color: #1a1a1a; font-size: 14px;">${data.hearAboutUs}</td>
                </tr>
                ` : ''}
              </table>
              ` : ''}

              <!-- Message -->
              ${data.message ? `
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; font-weight: 600; border-bottom: 2px solid #18181B; padding-bottom: 10px;">
                Message
              </h2>
              
              <div style="background-color: #f9f9f9; border-left: 4px solid #F59E0B; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
              </div>
              ` : ''}

              <!-- CTA Button -->
              ${data.dashboardLink ? `
              <div style="text-align: center; margin-top: 30px;">
                <a href="${data.dashboardLink}" style="display: inline-block; background-color: #18181B; color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  View in Dashboard →
                </a>
              </div>
              ` : ''}

              <!-- Quick Actions -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px; font-weight: 600;">Quick Actions:</p>
                <div style="display: flex; gap: 10px;">
                  <a href="mailto:${data.email}" style="display: inline-block; background-color: #3B82F6; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">
                    📧 Reply via Email
                  </a>
                  ${data.phone ? `
                  <a href="tel:${data.phone}" style="display: inline-block; background-color: #10B981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">
                    📞 Call Now
                  </a>
                  ` : ''}
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                This is an automated notification from Aureon One Lead Management System
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
New Lead Received - ${data.submittedAt}

Lead Type: ${data.leadType.replace('_', ' ').toUpperCase()}

CONTACT INFORMATION:
Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.company ? `Company: ${data.company}` : ''}

${data.serviceInterest || data.budget || data.timeline ? `
INQUIRY DETAILS:
${data.serviceInterest ? `Service Interest: ${data.serviceInterest}` : ''}
${data.budget ? `Budget: ${data.budget}` : ''}
${data.timeline ? `Timeline: ${data.timeline}` : ''}
${data.hearAboutUs ? `Source: ${data.hearAboutUs}` : ''}
` : ''}

${data.message ? `
MESSAGE:
${data.message}
` : ''}

${data.dashboardLink ? `View in Dashboard: ${data.dashboardLink}` : ''}

Reply to this lead: mailto:${data.email}
${data.phone ? `Call: ${data.phone}` : ''}
  `.trim();

  return { subject, html, text };
}

/**
 * Auto-Response Email Template
 * Sent to the lead after they submit a form
 * Optimized for cross-sell and lead retention
 */
export function getAutoResponseEmail(data: AutoResponseData): { subject: string; html: string; text: string } {
  const firstName = data.name ? (data.name.split(' ')[0] || data.name) : 'Marketer';
  const subject = firstName === 'Marketer'
    ? 'Your marketing transformation starts now! 🚀'
    : `${firstName}, your marketing transformation starts now! 🚀`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You - Aureon One</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111111; border-radius: 8px; overflow: hidden; border: 1px solid #2A2A2A;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272A 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 70px; height: 70px; background-color: #000000; border-radius: 50%; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="font-size: 36px;">🚀</span>
              </div>
              <h1 style="margin: 0; color: #000000; font-size: 28px; font-weight: bold;">
                We Got Your Message${firstName !== 'Marketer' ? `, ${firstName}` : ''}!
              </h1>
              <p style="margin: 10px 0 0 0; color: #000000; opacity: 0.9; font-size: 14px; font-weight: 500;">
                Your marketing transformation journey begins here
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 16px; line-height: 1.6;">
                Thank you for reaching out${data.serviceInterest ? ` about <strong style="color: #18181B;">${data.serviceInterest}</strong>` : ''}! We're thrilled to help you unlock your business's full marketing potential.
              </p>

              <!-- What Happens Next -->
              <div style="background: linear-gradient(135deg, #F4F4F5 0%, #E4E4E7 100%); border-left: 4px solid #18181B; padding: 25px; margin: 30px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="margin: 0 0 15px 0; color: #18181B; font-size: 18px; font-weight: 700;">
                  ⏱️ What Happens Next?
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #18181B; font-weight: bold; margin-right: 10px;">1.</span>
                      <span style="color: #FFFFFF; font-size: 14px;">Our expert team reviews your inquiry (within 2 hours)</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #18181B; font-weight: bold; margin-right: 10px;">2.</span>
                      <span style="color: #FFFFFF; font-size: 14px;">We'll contact you within <strong>24 hours</strong> with a personalized plan</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #18181B; font-weight: bold; margin-right: 10px;">3.</span>
                      <span style="color: #FFFFFF; font-size: 14px;">Start seeing results within weeks, not months!</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Exclusive Offer / Value Proposition -->
              <div style="background-color: #FAFAFA; border: 2px solid #18181B; padding: 25px; margin: 30px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #18181B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                  🎁 Limited Time Offer
                </p>
                <h3 style="margin: 0 0 15px 0; color: #FFFFFF; font-size: 22px; font-weight: 700;">
                  Get a FREE Marketing Audit
                </h3>
                <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 14px; line-height: 1.6;">
                  Worth $500 - Yours FREE when you schedule a consultation this week!<br/>
                  <span style="color: #FFFFFF; font-weight: 600;">Discover untapped opportunities in your marketing strategy.</span>
                </p>
                <a href="https://www.aureonone.com/contact?ref=email" style="display: inline-block; background: linear-gradient(135deg, #18181B 0%, #27272A 100%); color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; margin-top: 10px;">
                  Claim Your Free Audit →
                </a>
              </div>

              <!-- Why Choose Aureon One -->
              <h3 style="margin: 35px 0 20px 0; color: #FFFFFF; font-size: 20px; font-weight: 700; text-align: center;">
                Why 500+ Businesses Trust Aureon One
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #1A1A1A; border-radius: 8px; margin-bottom: 10px;" width="50%">
                    <div style="text-align: center;">
                      <span style="font-size: 32px; display: block; margin-bottom: 10px;">📊</span>
                      <h4 style="margin: 0 0 8px 0; color: #18181B; font-size: 16px; font-weight: 700;">Data-Driven Results</h4>
                      <p style="margin: 0; color: #A0A0A0; font-size: 13px; line-height: 1.5;">Average 3.5x ROI increase in first 6 months</p>
                    </div>
                  </td>
                  <td style="width: 15px;"></td>
                  <td style="padding: 15px; background-color: #1A1A1A; border-radius: 8px;" width="50%">
                    <div style="text-align: center;">
                      <span style="font-size: 32px; display: block; margin-bottom: 10px;">⚡</span>
                      <h4 style="margin: 0 0 8px 0; color: #18181B; font-size: 16px; font-weight: 700;">Fast Implementation</h4>
                      <p style="margin: 0; color: #A0A0A0; font-size: 13px; line-height: 1.5;">Launch campaigns in days, not months</p>
                    </div>
                  </td>
                </tr>
                <tr><td colspan="3" style="height: 15px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #1A1A1A; border-radius: 8px;" width="50%">
                    <div style="text-align: center;">
                      <span style="font-size: 32px; display: block; margin-bottom: 10px;">🎯</span>
                      <h4 style="margin: 0 0 8px 0; color: #18181B; font-size: 16px; font-weight: 700;">10+ Years Expertise</h4>
                      <p style="margin: 0; color: #A0A0A0; font-size: 13px; line-height: 1.5;">Proven strategies across 50+ industries</p>
                    </div>
                  </td>
                  <td style="width: 15px;"></td>
                  <td style="padding: 15px; background-color: #1A1A1A; border-radius: 8px;" width="50%">
                    <div style="text-align: center;">
                      <span style="font-size: 32px; display: block; margin-bottom: 10px;">💎</span>
                      <h4 style="margin: 0 0 8px 0; color: #18181B; font-size: 16px; font-weight: 700;">Premium Support</h4>
                      <p style="margin: 0; color: #A0A0A0; font-size: 13px; line-height: 1.5;">Dedicated account manager & 24/7 support</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Our Services (Cross-Sell) -->
              <div style="background: linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%); padding: 25px; margin: 30px 0; border-radius: 8px; border: 1px solid #2A2A2A;">
                <h3 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 18px; font-weight: 700; text-align: center;">
                  🌟 Explore Our Full Suite of Services
                </h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #A0A0A0; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #2A2A2A;">
                      <span style="color: #18181B; margin-right: 8px;">✓</span> Marketing Strategy Development
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #A0A0A0; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #2A2A2A;">
                      <span style="color: #18181B; margin-right: 8px;">✓</span> Digital Advertising (Google, Meta, LinkedIn)
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #A0A0A0; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #2A2A2A;">
                      <span style="color: #18181B; margin-right: 8px;">✓</span> Content Marketing & SEO
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #A0A0A0; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #2A2A2A;">
                      <span style="color: #18181B; margin-right: 8px;">✓</span> Social Media Management
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #A0A0A0; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #2A2A2A;">
                      <span style="color: #18181B; margin-right: 8px;">✓</span> Email Marketing & Automation
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #A0A0A0; font-size: 14px; padding: 8px 0;">
                      <span style="color: #18181B; margin-right: 8px;">✓</span> Analytics & Performance Tracking
                    </td>
                  </tr>
                </table>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="https://www.aureonone.com/services" style="color: #18181B; text-decoration: none; font-weight: 600; font-size: 14px;">
                    View All Services →
                  </a>
                </div>
              </div>

              <!-- Social Proof -->
              <div style="background-color: #1A1A1A; padding: 20px; margin: 30px 0; border-radius: 8px; border-left: 4px solid #10B981;">
                <p style="margin: 0 0 10px 0; color: #FFFFFF; font-size: 14px; font-style: italic; line-height: 1.6;">
                  "Aureon One transformed our marketing strategy. We saw a 250% increase in qualified leads within 3 months!"
                </p>
                <p style="margin: 0; color: #A0A0A0; font-size: 12px;">
                  <strong style="color: #FFFFFF;">— Sarah Johnson</strong>, CEO at TechStart Inc.
                </p>
              </div>

            </td>
          </tr>

          <!-- CTA Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272A 100%); padding: 35px 30px; text-align: center;">
              <h3 style="margin: 0 0 15px 0; color: #000000; font-size: 20px; font-weight: 700;">
                Ready to Accelerate Your Growth?
              </h3>
              <p style="margin: 0 0 25px 0; color: #000000; opacity: 0.9; font-size: 14px;">
                Don't wait for us to reach out - schedule your free consultation now!
              </p>
              <a href="https://www.aureonone.com/contact?ref=email_cta" style="display: inline-block; background-color: #FFFFFF; color: #000000; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; border: 2px solid #FFFFFF;">
                Schedule Free Consultation
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px; text-align: center; border-top: 1px solid #2A2A2A;">
              <p style="margin: 0 0 15px 0; color: #FFFFFF; font-size: 16px; font-weight: 600;">
                Questions? We're Here to Help!
              </p>
              <p style="margin: 0 0 20px 0; color: #A0A0A0; font-size: 14px;">
                📧 <a href="mailto:hello@aureonone.com" style="color: #FFFFFF; text-decoration: none; font-weight: 600;">hello@aureonone.com</a><br/>
                🌐 <a href="https://www.aureonone.com" style="color: #FFFFFF; text-decoration: none; font-weight: 600;">www.aureonone.com</a>
              </p>

              <!-- Social Links -->
              <div style="margin: 25px 0;">
                <a href="https://www.linkedin.com/company/aureonone" style="display: inline-block; margin: 0 8px; color: #A0A0A0; text-decoration: none; font-size: 12px;">LinkedIn</a>
                <span style="color: #2A2A2A;">|</span>
                <a href="https://twitter.com/aureonone" style="display: inline-block; margin: 0 8px; color: #A0A0A0; text-decoration: none; font-size: 12px;">Twitter</a>
                <span style="color: #2A2A2A;">|</span>
                <a href="https://www.facebook.com/aureonone" style="display: inline-block; margin: 0 8px; color: #A0A0A0; text-decoration: none; font-size: 12px;">Facebook</a>
              </div>

              <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #2A2A2A;">
                <p style="margin: 0 0 10px 0; color: #707070; font-size: 12px;">
                  © 2024 Aureon One. All rights reserved.
                </p>
                <p style="margin: 0; color: #707070; font-size: 11px;">
                  You're receiving this email because you contacted us through our website.<br/>
                  We respect your privacy and will never share your information.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
WE GOT YOUR MESSAGE${firstName !== 'Marketer' ? `, ${firstName.toUpperCase()}` : ''}!
Your marketing transformation journey begins here 🚀

Thank you for reaching out${data.serviceInterest ? ` about ${data.serviceInterest}` : ''}! We're thrilled to help you unlock your business's full marketing potential.

⏱️ WHAT HAPPENS NEXT?
1. Our expert team reviews your inquiry (within 2 hours)
2. We'll contact you within 24 hours with a personalized plan
3. Start seeing results within weeks, not months!

🎁 LIMITED TIME OFFER
Get a FREE Marketing Audit (Worth $500)
Yours FREE when you schedule a consultation this week!
Discover untapped opportunities in your marketing strategy.
→ Claim Your Free Audit: https://www.aureonone.com/contact?ref=email

WHY 500+ BUSINESSES TRUST MEDIAPLANPRO:
📊 Data-Driven Results - Average 3.5x ROI increase in first 6 months
⚡ Fast Implementation - Launch campaigns in days, not months
🎯 10+ Years Expertise - Proven strategies across 50+ industries
💎 Premium Support - Dedicated account manager & 24/7 support

🌟 OUR FULL SUITE OF SERVICES:
✓ Marketing Strategy Development
✓ Digital Advertising (Google, Meta, LinkedIn)
✓ Content Marketing & SEO
✓ Social Media Management
✓ Email Marketing & Automation
✓ Analytics & Performance Tracking

View All Services: https://www.aureonone.com/services

💬 CLIENT SUCCESS STORY:
"Aureon One transformed our marketing strategy. We saw a 250% increase in qualified leads within 3 months!"
— Sarah Johnson, CEO at TechStart Inc.

READY TO ACCELERATE YOUR GROWTH?
Don't wait for us to reach out - schedule your free consultation now!
→ Schedule Free Consultation: https://www.aureonone.com/contact?ref=email_cta

QUESTIONS? WE'RE HERE TO HELP!
📧 hello@aureonone.com
🌐 www.aureonone.com

© 2024 Aureon One. All rights reserved.
You're receiving this email because you contacted us through our website.
We respect your privacy and will never share your information.
  `.trim();

  return { subject, html, text };
}

