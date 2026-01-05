import { Metadata } from 'next';
import { LegalPageLayout, Section, Subsection, Paragraph, List } from '@/components/legal/legal-page-layout';

export const metadata: Metadata = {
  title: 'Terms of Service | Aureon One',
  description: 'Read Aureon One\'s terms of service to understand the rules and regulations governing the use of our AI-powered marketing strategy platform.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="January 1, 2024">
      <Section title="1. Agreement to Terms">
        <Paragraph>
          By accessing or using Aureon One ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
        </Paragraph>
        <Paragraph>
          These Terms apply to all visitors, users, and others who access or use the Service.
        </Paragraph>
      </Section>

      <Section title="2. Description of Service">
        <Paragraph>
          Aureon One is an AI-powered marketing strategy platform that helps businesses create professional marketing plans. The Service includes:
        </Paragraph>
        <List items={[
          'Marketing strategy generation tools',
          'Strategy templates and frameworks',
          'Analytics and reporting features',
          'Collaboration and team management tools',
          'Export and sharing capabilities'
        ]} />
      </Section>

      <Section title="3. User Accounts">
        <Subsection title="3.1 Account Creation">
          <Paragraph>
            To use certain features of the Service, you must register for an account. You agree to:
          </Paragraph>
          <List items={[
            'Provide accurate, current, and complete information',
            'Maintain and update your information',
            'Keep your password secure and confidential',
            'Notify us immediately of any unauthorized access',
            'Be responsible for all activities under your account'
          ]} />
        </Subsection>

        <Subsection title="3.2 Account Termination">
          <Paragraph>
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.
          </Paragraph>
        </Subsection>
      </Section>

      <Section title="4. Subscription and Payment">
        <Subsection title="4.1 Subscription Plans">
          <Paragraph>
            We offer various subscription plans with different features and pricing. By subscribing, you agree to pay the fees associated with your chosen plan.
          </Paragraph>
        </Subsection>

        <Subsection title="4.2 Billing">
          <Paragraph>
            Subscription fees are billed in advance on a recurring basis (monthly or annually). You authorize us to charge your payment method for all fees.
          </Paragraph>
        </Subsection>

        <Subsection title="4.3 Refunds">
          <Paragraph>
            Refunds are provided at our discretion. Please contact us if you have concerns about your subscription.
          </Paragraph>
        </Subsection>

        <Subsection title="4.4 Cancellation">
          <Paragraph>
            You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period.
          </Paragraph>
        </Subsection>
      </Section>

      <Section title="5. Acceptable Use">
        <Paragraph>
          You agree not to:
        </Paragraph>
        <List items={[
          'Use the Service for any illegal purpose',
          'Violate any laws or regulations',
          'Infringe on intellectual property rights',
          'Transmit viruses or malicious code',
          'Attempt to gain unauthorized access',
          'Interfere with the Service or servers',
          'Impersonate others or provide false information',
          'Harass, abuse, or harm other users'
        ]} />
      </Section>

      <Section title="6. Intellectual Property">
        <Paragraph>
          The Service and its original content, features, and functionality are owned by Aureon One and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </Paragraph>
        <Paragraph>
          You retain ownership of the marketing strategies and content you create using the Service. By using the Service, you grant us a license to use your content solely to provide and improve the Service.
        </Paragraph>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <Paragraph>
          The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
        </Paragraph>
      </Section>

      <Section title="8. Limitation of Liability">
        <Paragraph>
          To the maximum extent permitted by law, Aureon One shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
        </Paragraph>
      </Section>

      <Section title="9. Indemnification">
        <Paragraph>
          You agree to indemnify and hold harmless Aureon One from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.
        </Paragraph>
      </Section>

      <Section title="10. Changes to Terms">
        <Paragraph>
          We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date.
        </Paragraph>
      </Section>

      <Section title="11. Governing Law">
        <Paragraph>
          These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
        </Paragraph>
      </Section>

      <Section title="12. Contact Us">
        <Paragraph>
          If you have any questions about these Terms, please contact us:
        </Paragraph>
        <List items={[
          'Email: hello@aureonone.in',
          'Website: www.aureonone.in',
          'Address: 123 Marketing Street, San Francisco, CA 94102, United States'
        ]} />
      </Section>
    </LegalPageLayout>
  );
}
