import { Metadata } from 'next';
import { LegalPageLayout, Section, Subsection, Paragraph, List } from '@/components/legal/legal-page-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Aureon One',
  description: 'Read Aureon One\'s privacy policy to understand how we collect, use, and protect your personal information. Your privacy is our priority.',
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="January 1, 2024">
      <Section title="1. Introduction">
        <Paragraph>
          Welcome to Aureon One ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketing strategy platform.
        </Paragraph>
        <Paragraph>
          Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
        </Paragraph>
      </Section>

      <Section title="2. Information We Collect">
        <Subsection title="2.1 Personal Information">
          <Paragraph>
            We collect personal information that you voluntarily provide to us when you:
          </Paragraph>
          <List items={[
            'Register for an account',
            'Create marketing strategies',
            'Contact us for support',
            'Subscribe to our newsletter',
            'Participate in surveys or promotions'
          ]} />
          <Paragraph>
            This information may include:
          </Paragraph>
          <List items={[
            'Name and email address',
            'Company name and business information',
            'Payment information (processed securely by third-party providers)',
            'Marketing strategy data and preferences',
            'Communication preferences'
          ]} />
        </Subsection>

        <Subsection title="2.2 Automatically Collected Information">
          <Paragraph>
            When you use our application, we automatically collect certain information, including:
          </Paragraph>
          <List items={[
            'Log data (IP address, browser type, operating system)',
            'Device information',
            'Usage data (pages visited, features used, time spent)',
            'Cookies and similar tracking technologies'
          ]} />
        </Subsection>
      </Section>

      <Section title="3. How We Use Your Information">
        <Paragraph>
          We use the information we collect to:
        </Paragraph>
        <List items={[
          'Provide, operate, and maintain our services',
          'Process your transactions and manage your account',
          'Send you updates, newsletters, and marketing communications',
          'Respond to your inquiries and provide customer support',
          'Improve and personalize your experience',
          'Analyze usage patterns and optimize our platform',
          'Detect, prevent, and address technical issues or fraud',
          'Comply with legal obligations'
        ]} />
      </Section>

      <Section title="4. Information Sharing and Disclosure">
        <Paragraph>
          We may share your information in the following situations:
        </Paragraph>
        <List items={[
          'Service Providers: We share information with third-party vendors who perform services on our behalf (e.g., payment processing, analytics, email delivery)',
          'Business Transfers: In connection with any merger, sale of company assets, or acquisition',
          'Legal Requirements: When required by law or to protect our rights',
          'With Your Consent: When you explicitly agree to share your information'
        ]} />
        <Paragraph>
          We do not sell your personal information to third parties.
        </Paragraph>
      </Section>

      <Section title="5. Data Security">
        <Paragraph>
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </Paragraph>
      </Section>

      <Section title="6. Data Retention">
        <Paragraph>
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
        </Paragraph>
      </Section>

      <Section title="7. Your Privacy Rights">
        <Paragraph>
          Depending on your location, you may have the following rights:
        </Paragraph>
        <List items={[
          'Access: Request a copy of your personal data',
          'Correction: Request correction of inaccurate data',
          'Deletion: Request deletion of your personal data',
          'Objection: Object to processing of your data',
          'Restriction: Request restriction of processing',
          'Portability: Request transfer of your data',
          'Withdraw Consent: Withdraw consent at any time'
        ]} />
        <Paragraph>
          To exercise these rights, please contact us at hello@aureonone.in.
        </Paragraph>
      </Section>

      <Section title="8. Cookies and Tracking Technologies">
        <Paragraph>
          We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. For more information, see our Cookie Policy.
        </Paragraph>
      </Section>

      <Section title="9. Third-Party Services">
        <Paragraph>
          Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
        </Paragraph>
      </Section>

      <Section title="10. Children's Privacy">
        <Paragraph>
          Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
        </Paragraph>
      </Section>

      <Section title="11. International Data Transfers">
        <Paragraph>
          Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. We will take all steps reasonably necessary to ensure that your data is treated securely.
        </Paragraph>
      </Section>

      <Section title="12. Changes to This Privacy Policy">
        <Paragraph>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </Paragraph>
      </Section>

      <Section title="13. Contact Us">
        <Paragraph>
          If you have any questions about this Privacy Policy, please contact us:
        </Paragraph>
        <List items={[
          'Email: hello@mediaplanpro.com',
          'Website: www.mediaplanpro.com',
          'Address: 123 Marketing Street, San Francisco, CA 94102, United States'
        ]} />
      </Section>
    </LegalPageLayout>
  );
}
