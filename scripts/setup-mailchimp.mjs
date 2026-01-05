/**
 * Setup Mailchimp Integration
 * 
 * This script initializes the Mailchimp integration in the database
 * Run with: node scripts/setup-mailchimp.mjs
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption function (same as in src/lib/encryption.ts)
function encrypt(text) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars', 'utf-8').slice(0, 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

async function setupMailchimpIntegration() {
  try {
    console.log('🚀 Setting up Mailchimp integration...');

    // Mailchimp credentials
    const MAILCHIMP_API_KEY = '32c33c610c12220891a7d83908858ffb-us2';
    const SERVER_PREFIX = 'us2';

    // Check if integration already exists
    const existing = await prisma.integration.findFirst({
      where: {
        type: 'MAILCHIMP',
      },
    });

    if (existing) {
      console.log('✅ Mailchimp integration already exists');
      console.log('   ID:', existing.id);
      console.log('   Status:', existing.status);
      console.log('   Active:', existing.isActive);
      
      // Update if needed
      const updated = await prisma.integration.update({
        where: { id: existing.id },
        data: {
          apiKey: encrypt(MAILCHIMP_API_KEY),
          serverPrefix: SERVER_PREFIX,
          isActive: true,
          status: 'ACTIVE',
          settings: {
            automations: {
              syncContacts: true,
              syncInquiries: true,
              syncPurchases: true,
              sendBlogNewsletters: false,
            },
          },
        },
      });
      
      console.log('✅ Updated existing integration');
      return updated;
    }

    // Create new integration
    const integration = await prisma.integration.create({
      data: {
        type: 'MAILCHIMP',
        name: 'Mailchimp Marketing',
        description: 'Email marketing and automation platform',
        apiKey: encrypt(MAILCHIMP_API_KEY),
        serverPrefix: SERVER_PREFIX,
        isActive: true,
        status: 'ACTIVE',
        settings: {
          automations: {
            syncContacts: true,
            syncInquiries: true,
            syncPurchases: true,
            sendBlogNewsletters: false,
          },
        },
      },
    });

    console.log('✅ Created Mailchimp integration');
    console.log('   ID:', integration.id);
    console.log('   Status:', integration.status);
    console.log('   Active:', integration.isActive);
    
    return integration;
  } catch (error) {
    console.error('❌ Failed to setup Mailchimp integration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupMailchimpIntegration()
  .then(() => {
    console.log('\n✅ Mailchimp integration setup complete!');
    console.log('   Next steps:');
    console.log('   1. Go to /dashboard/admin/integrations/mailchimp');
    console.log('   2. Test the connection');
    console.log('   3. Select a default audience');
    console.log('   4. Save the configuration');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  });

