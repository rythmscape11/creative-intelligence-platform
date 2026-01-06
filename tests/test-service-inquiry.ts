// Test script for service inquiry form submission
const testInquiry = async () => {
  const response = await fetch('http://localhost:3000/api/services/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'hello@mediaplanpro.com',
      phone: '+1234567890',
      company: 'Test Company',
      serviceInterest: 'Marketing Strategy',
      budgetRange: '$5,000 - $10,000',
      timeline: '1-3 months',
      message: 'This is a test inquiry to verify the email flow is working correctly.',
      hearAboutUs: 'Google Search',
      source: 'test_script',
    }),
  });

  const data = await response.json();
  console.log('Response:', data);
  
  if (response.ok) {
    console.log('✅ Service inquiry submitted successfully!');
    console.log('📧 Check hello@mediaplanpro.com for:');
    console.log('   1. Admin notification email');
    console.log('   2. Auto-response email');
  } else {
    console.error('❌ Service inquiry failed:', data);
  }
};

testInquiry().catch(console.error);
