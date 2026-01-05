/**
 * Mailchimp Integration Setup Script
 * 
 * This script configures the Mailchimp integration in the database
 * Run with: node scripts/setup-mailchimp.js
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Encryption function (matches src/lib/encryption.ts)
function encrypt(text) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', 'utf8');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

async function setupMailchimp() {
  try {
    console.log('🚀 Setting up Mailchimp integration...\n');

    // Get environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    const replyTo = process.env.MAILCHIMP_REPLY_TO;

    if (!apiKey || !serverPrefix) {
      console.error('❌ Error: MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX must be set in .env');
      process.exit(1);
    }

    console.log('📋 Configuration:');
    console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`   Server Prefix: ${serverPrefix}`);
    console.log(`   Reply-To: ${replyTo || 'Not set'}\n`);

    // Get or create admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminUser) {
      console.log('⚠️  No admin user found. Creating system user...\n');
      adminUser = await prisma.user.create({
        data: {
          email: 'system@mediaplanpro.com',
          name: 'System',
          role: 'ADMIN',
        },
      });
      console.log(`✅ Created system user: ${adminUser.email}\n`);
    } else {
      console.log(`✅ Using admin user: ${adminUser.email}\n`);
    }

    // Check if integration already exists
    const existing = await prisma.integration.findFirst({
      where: { type: 'MAILCHIMP' },
    });

    if (existing) {
      console.log('⚠️  Mailchimp integration already exists. Updating...\n');

      // Update existing integration
      const updated = await prisma.integration.update({
        where: { id: existing.id },
        data: {
          name: 'Mailchimp',
          apiKey: encrypt(apiKey),
          serverPrefix: serverPrefix,
          isActive: true,
          status: 'ACTIVE',
          settings: {
            replyTo: replyTo || 'hello@mediaplanpro.com',
            automations: {
              syncContacts: true,
              syncInquiries: true,
              syncPurchases: true,
              sendBlogNewsletters: true,
            },
          },
          lastSyncAt: new Date(),
        },
      });

      console.log('✅ Mailchimp integration updated successfully!');
      console.log(`   Integration ID: ${updated.id}`);
      console.log(`   Status: ${updated.status}`);
      console.log(`   Active: ${updated.isActive}\n`);
    } else {
      console.log('📝 Creating new Mailchimp integration...\n');

      // Create new integration
      const integration = await prisma.integration.create({
        data: {
          userId: adminUser.id,
          type: 'MAILCHIMP',
          category: 'EMAIL_MARKETING',
          name: 'Mailchimp',
          description: 'Email marketing and automation platform',
          apiKey: encrypt(apiKey),
          serverPrefix: serverPrefix,
          isActive: true,
          status: 'ACTIVE',
          settings: {
            replyTo: replyTo || 'hello@mediaplanpro.com',
            automations: {
              syncContacts: true,
              syncInquiries: true,
              syncPurchases: true,
              sendBlogNewsletters: true,
            },
          },
          lastSyncAt: new Date(),
        },
      });

      console.log('✅ Mailchimp integration created successfully!');
      console.log(`   Integration ID: ${integration.id}`);
      console.log(`   Status: ${integration.status}`);
      console.log(`   Active: ${integration.isActive}\n`);
    }

    // Test Mailchimp connection
    console.log('🔍 Testing Mailchimp connection...\n');
    
    const mailchimp = require('@mailchimp/mailchimp_marketing');
    mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix,
    });

    try {
      const response = await mailchimp.ping.get();
      console.log('✅ Mailchimp connection successful!');
      console.log(`   Health Status: ${response.health_status}\n`);
    } catch (error) {
      console.error('❌ Mailchimp connection failed:', error.message);
      console.error('   Please verify your API key and server prefix\n');
    }

    // Get audiences (lists)
    try {
      console.log('📋 Fetching Mailchimp audiences...\n');
      const audiences = await mailchimp.lists.getAllLists();
      
      if (audiences.lists && audiences.lists.length > 0) {
        console.log(`✅ Found ${audiences.lists.length} audience(s):\n`);
        
        audiences.lists.forEach((list, index) => {
          console.log(`   ${index + 1}. ${list.name}`);
          console.log(`      ID: ${list.id}`);
          console.log(`      Members: ${list.stats.member_count}`);
          console.log(`      Subscribed: ${list.stats.member_count_since_send}\n`);
        });

        // Set default audience to the first one
        const defaultAudience = audiences.lists[0];
        const integration = await prisma.integration.findFirst({
          where: { type: 'MAILCHIMP' },
        });

        if (integration) {
          const currentSettings = integration.settings || {};
          await prisma.integration.update({
            where: { id: integration.id },
            data: {
              settings: {
                ...currentSettings,
                audienceId: defaultAudience.id,
                audienceName: defaultAudience.name,
              },
            },
          });
          console.log(`✅ Set default audience to: ${defaultAudience.name} (${defaultAudience.id})\n`);
        }
      } else {
        console.log('⚠️  No audiences found. Please create an audience in Mailchimp.\n');
      }
    } catch (error) {
      console.error('❌ Failed to fetch audiences:', error.message);
      console.error('   You can set the audience ID manually in the admin panel\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Mailchimp integration setup complete!\n');
    console.log('📍 Next Steps:');
    console.log('   1. Visit /dashboard/admin/integrations/mailchimp');
    console.log('   2. Verify the configuration');
    console.log('   3. Test the connection');
    console.log('   4. Select your default audience if not already set');
    console.log('   5. Enable desired automations\n');
    console.log('🎉 Your Mailchimp integration is ready to use!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup
setupMailchimp();

