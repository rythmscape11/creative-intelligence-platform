/**
 * Test script for lead capture forms
 * Tests both service inquiry and general lead capture forms
 */

const testServiceInquiry = async () => {
  console.log('\n🧪 Testing Service Inquiry Form...\n');
  
  const testData = {
    name: 'Test User - Service Inquiry',
    email: 'hello@mediaplanpro.com',
    phone: '+1-555-0123',
    company: 'Test Company Inc.',
    serviceInterest: 'Marketing Strategy Development',
    serviceSlug: 'marketing-strategy',
    budgetRange: '$5,000 - $10,000',
    message: 'This is a test inquiry to verify the lead capture form is working correctly. Please confirm receipt of this test email.',
    hearAboutUs: 'Search Engine',
    source: 'test-script',
  };

  try {
    const response = await fetch('http://localhost:3000/api/services/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Service Inquiry Form Test PASSED');
      console.log('Response:', JSON.stringify(data, null, 2));
      console.log('\n📧 Expected Emails:');
      console.log('  1. Admin notification to: hello@mediaplanpro.com');
      console.log('  2. Auto-response to: hello@mediaplanpro.com');
      console.log('\n💾 Database Records Created:');
      console.log('  - ServiceInquiry record');
      console.log('  - LeadCapture record');
      console.log('\n🔗 Integrations Triggered:');
      console.log('  - Google Sheets sync (async)');
      console.log('  - Mailchimp sync (async)');
    } else {
      console.log('❌ Service Inquiry Form Test FAILED');
      console.log('Status:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Service Inquiry Form Test ERROR');
    console.error('Error:', error);
  }
};

const testLeadCapture = async () => {
  console.log('\n🧪 Testing General Lead Capture Form...\n');
  
  const testData = {
    email: 'hello@mediaplanpro.com',
    name: 'Test User - Lead Capture',
    source: 'test-script',
  };

  try {
    const response = await fetch('http://localhost:3000/api/lead-capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Lead Capture Form Test PASSED');
      console.log('Response:', JSON.stringify(data, null, 2));
      console.log('\n📧 Expected Emails:');
      console.log('  1. Welcome email to: hello@mediaplanpro.com');
      console.log('\n💾 Database Records Created:');
      console.log('  - LeadCapture record');
      console.log('  - EmailSubscriber record');
      console.log('\n🔗 Integrations Triggered:');
      console.log('  - Google Sheets sync (async)');
      console.log('  - Mailchimp sync (async)');
    } else {
      console.log('❌ Lead Capture Form Test FAILED');
      console.log('Status:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Lead Capture Form Test ERROR');
    console.error('Error:', error);
  }
};

const runAllTests = async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  LEAD CAPTURE FORM TESTING');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📝 This script will test both lead capture forms:');
  console.log('  1. Service Inquiry Form (/api/services/inquiry)');
  console.log('  2. General Lead Capture Form (/api/lead-capture)');
  console.log('\n📧 All test emails will be sent to: hello@mediaplanpro.com');
  console.log('\n⏳ Starting tests in 2 seconds...\n');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 1: Service Inquiry Form
  await testServiceInquiry();

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: General Lead Capture Form
  await testLeadCapture();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  TESTING COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n✅ Next Steps:');
  console.log('  1. Check your email inbox (hello@mediaplanpro.com)');
  console.log('  2. Verify you received:');
  console.log('     - Admin notification for service inquiry');
  console.log('     - Auto-response for service inquiry');
  console.log('     - Welcome email for lead capture');
  console.log('  3. Check Resend dashboard for email delivery status');
  console.log('  4. Verify database records were created');
  console.log('  5. Check Google Sheets for synced data (if configured)');
  console.log('  6. Check Mailchimp for new subscribers (if configured)');
  console.log('\n');
};

runAllTests().catch(console.error);

