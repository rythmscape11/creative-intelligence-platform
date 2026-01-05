import mailchimp from '@mailchimp/mailchimp_marketing';
import { decrypt } from './encryption';

export interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
}

export interface MailchimpContact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  mergeFields?: Record<string, any>;
}

export interface MailchimpAudience {
  id: string;
  name: string;
  stats: {
    member_count: number;
    unsubscribe_count: number;
    cleaned_count: number;
  };
}

export interface MailchimpCampaign {
  id: string;
  type: 'regular' | 'plaintext' | 'absplit' | 'rss' | 'variate';
  recipients: {
    list_id: string;
  };
  settings: {
    subject_line: string;
    preview_text?: string;
    title: string;
    from_name: string;
    reply_to: string;
  };
}

/**
 * Initialize Mailchimp client with configuration
 */
export function initializeMailchimp(config: MailchimpConfig) {
  mailchimp.setConfig({
    apiKey: config.apiKey,
    server: config.serverPrefix,
  });

  return mailchimp;
}

/**
 * Test Mailchimp connection
 */
export async function testMailchimpConnection(config: MailchimpConfig): Promise<boolean> {
  try {
    const client = initializeMailchimp(config);
    await client.ping.get();
    return true;
  } catch (error) {
    console.error('Mailchimp connection test failed:', error);
    return false;
  }
}

/**
 * Get all audiences (lists)
 */
export async function getMailchimpAudiences(config: MailchimpConfig): Promise<MailchimpAudience[]> {
  try {
    const client = initializeMailchimp(config);
    const response = await client.lists.getAllLists({ count: 100 });

    return response.lists.map((list: any) => ({
      id: list.id,
      name: list.name,
      stats: {
        member_count: list.stats.member_count,
        unsubscribe_count: list.stats.unsubscribe_count,
        cleaned_count: list.stats.cleaned_count,
      },
    }));
  } catch (error) {
    console.error('Failed to fetch Mailchimp audiences:', error);
    throw error;
  }
}

/**
 * Add or update a contact in Mailchimp audience
 */
export async function syncContactToMailchimp(
  config: MailchimpConfig,
  audienceId: string,
  contact: MailchimpContact,
  tags?: string[]
): Promise<any> {
  try {
    const client = initializeMailchimp(config);

    // Prepare member data
    const memberData: any = {
      email_address: contact.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: contact.firstName || '',
        LNAME: contact.lastName || '',
        PHONE: contact.phone || '',
        ...contact.mergeFields,
      },
    };

    // Add or update member
    const subscriberHash = require('crypto')
      .createHash('md5')
      .update(contact.email.toLowerCase())
      .digest('hex');

    const response = await client.lists.setListMember(
      audienceId,
      subscriberHash,
      memberData
    );

    // Add tags if provided
    if (tags && tags.length > 0) {
      await client.lists.updateListMemberTags(audienceId, subscriberHash, {
        tags: tags.map(tag => ({ name: tag, status: 'active' })),
      });
    }

    return response;
  } catch (error: any) {
    console.error('Failed to sync contact to Mailchimp:', error);
    throw error;
  }
}

/**
 * Add multiple contacts to Mailchimp audience (batch)
 */
export async function batchSyncContactsToMailchimp(
  config: MailchimpConfig,
  audienceId: string,
  contacts: MailchimpContact[]
): Promise<any> {
  try {
    const client = initializeMailchimp(config);

    const operations = contacts.map(contact => ({
      method: 'PUT',
      path: `/lists/${audienceId}/members/${require('crypto')
        .createHash('md5')
        .update(contact.email.toLowerCase())
        .digest('hex')}`,
      body: JSON.stringify({
        email_address: contact.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName || '',
          LNAME: contact.lastName || '',
          PHONE: contact.phone || '',
          ...contact.mergeFields,
        },
      }),
    }));

    const response = await client.batches.start({ operations });
    return response;
  } catch (error) {
    console.error('Failed to batch sync contacts to Mailchimp:', error);
    throw error;
  }
}

/**
 * Create a campaign
 */
export async function createMailchimpCampaign(
  config: MailchimpConfig,
  campaignData: Partial<MailchimpCampaign>
): Promise<any> {
  try {
    const client = initializeMailchimp(config);
    const response = await client.campaigns.create(campaignData);
    return response;
  } catch (error) {
    console.error('Failed to create Mailchimp campaign:', error);
    throw error;
  }
}

/**
 * Set campaign content
 */
export async function setMailchimpCampaignContent(
  config: MailchimpConfig,
  campaignId: string,
  htmlContent: string
): Promise<any> {
  try {
    const client = initializeMailchimp(config);
    const response = await client.campaigns.setContent(campaignId, {
      html: htmlContent,
    });
    return response;
  } catch (error) {
    console.error('Failed to set Mailchimp campaign content:', error);
    throw error;
  }
}

/**
 * Send a campaign
 */
export async function sendMailchimpCampaign(
  config: MailchimpConfig,
  campaignId: string
): Promise<any> {
  try {
    const client = initializeMailchimp(config);
    const response = await client.campaigns.send(campaignId);
    return response;
  } catch (error) {
    console.error('Failed to send Mailchimp campaign:', error);
    throw error;
  }
}

/**
 * Create and send a blog newsletter campaign
 */
export async function sendBlogNewsletter(
  config: MailchimpConfig,
  audienceId: string,
  blogPost: {
    title: string;
    excerpt: string;
    slug: string;
    featuredImage?: string;
    author: string;
  }
): Promise<any> {
  try {
    // Create campaign
    const campaign = await createMailchimpCampaign(config, {
      type: 'regular',
      recipients: {
        list_id: audienceId,
      },
      settings: {
        subject_line: blogPost.title,
        preview_text: blogPost.excerpt.substring(0, 150),
        title: `Blog: ${blogPost.title}`,
        from_name: 'Aureon One',
        reply_to: process.env.MAILCHIMP_REPLY_TO || 'hello@aureonone.in',
      },
    });

    // Create HTML content
    const htmlContent = generateBlogNewsletterHTML(blogPost);

    // Set campaign content
    await setMailchimpCampaignContent(config, campaign.id, htmlContent);

    // Send campaign
    await sendMailchimpCampaign(config, campaign.id);

    return campaign;
  } catch (error) {
    console.error('Failed to send blog newsletter:', error);
    throw error;
  }
}

/**
 * Generate HTML for blog newsletter
 */
function generateBlogNewsletterHTML(blogPost: {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  author: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in';
  const blogUrl = `${baseUrl}/blog/${blogPost.slug}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blogPost.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #18181B;">
              <h1 style="margin: 0; color: #000000; font-size: 28px; font-weight: bold;">Aureon One</h1>
            </td>
          </tr>
          
          <!-- Featured Image -->
          ${blogPost.featuredImage ? `
          <tr>
            <td>
              <img src="${blogPost.featuredImage}" alt="${blogPost.title}" style="width: 100%; height: auto; display: block;">
            </td>
          </tr>
          ` : ''}
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: bold;">${blogPost.title}</h2>
              <p style="margin: 0 0 20px 0; color: #D1D5DB; font-size: 16px; line-height: 1.6;">${blogPost.excerpt}</p>
              <p style="margin: 0 0 30px 0; color: #9CA3AF; font-size: 14px;">By ${blogPost.author}</p>
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius: 8px; background-color: #F59E0B;">
                    <a href="${blogUrl}" style="display: inline-block; padding: 16px 32px; color: #000000; text-decoration: none; font-weight: bold; font-size: 16px;">Read Full Article</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #0A0A0A; border-top: 1px solid #2A2A2A;">
              <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 14px;">© 2025 Aureon One. All rights reserved.</p>
              <p style="margin: 0; color: #6B7280; font-size: 12px;">
                <a href="*|UNSUB|*" style="color: #F59E0B; text-decoration: none;">Unsubscribe</a> | 
                <a href="${baseUrl}" style="color: #F59E0B; text-decoration: none;">Visit Website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

