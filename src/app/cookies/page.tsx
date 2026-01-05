import { Metadata } from 'next';
import { LegalPageLayout, Section, Subsection, Paragraph, List } from '@/components/legal/legal-page-layout';

export const metadata: Metadata = {
  title: 'Cookie Policy | Aureon One',
  description: 'Learn about how Aureon One uses cookies to improve your experience. Understand what cookies we use and how to manage your cookie preferences.',
  alternates: {
    canonical: '/cookies',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="January 1, 2024">
      <Section title="1. What Are Cookies?">
        <Paragraph>
          Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our Service.
        </Paragraph>
      </Section>

      <Section title="2. Types of Cookies We Use">
        <Subsection title="2.1 Essential Cookies">
          <Paragraph>
            These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and accessibility.
          </Paragraph>
          <List items={[
            'Session management',
            'Authentication and security',
            'Load balancing'
          ]} />
        </Subsection>

        <Subsection title="2.2 Analytics Cookies">
          <Paragraph>
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
          </Paragraph>
          <List items={[
            'Google Analytics',
            'Usage statistics',
            'Performance monitoring'
          ]} />
        </Subsection>

        <Subsection title="2.3 Functional Cookies">
          <Paragraph>
            These cookies enable enhanced functionality and personalization, such as remembering your preferences.
          </Paragraph>
          <List items={[
            'Language preferences',
            'Theme settings',
            'User interface customization'
          ]} />
        </Subsection>

        <Subsection title="2.4 Marketing Cookies">
          <Paragraph>
            These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.
          </Paragraph>
          <List items={[
            'Advertising targeting',
            'Campaign tracking',
            'Social media integration'
          ]} />
        </Subsection>
      </Section>

      <Section title="3. Third-Party Cookies">
        <Paragraph>
          We may use third-party services that set cookies on your device. These include:
        </Paragraph>
        <List items={[
          'Google Analytics for website analytics',
          'Payment processors for secure transactions',
          'Social media platforms for sharing features',
          'Advertising networks for targeted ads'
        ]} />
      </Section>

      <Section title="4. How We Use Cookies">
        <Paragraph>
          We use cookies to:
        </Paragraph>
        <List items={[
          'Keep you signed in to your account',
          'Remember your preferences and settings',
          'Understand how you use our Service',
          'Improve our website performance',
          'Personalize your experience',
          'Deliver relevant advertising',
          'Analyze traffic and usage patterns',
          'Prevent fraud and enhance security'
        ]} />
      </Section>

      <Section title="5. Managing Cookies">
        <Paragraph>
          You can control and manage cookies in various ways:
        </Paragraph>
        <Subsection title="5.1 Browser Settings">
          <Paragraph>
            Most browsers allow you to refuse or accept cookies. You can usually find these settings in the "Options" or "Preferences" menu of your browser.
          </Paragraph>
        </Subsection>

        <Subsection title="5.2 Cookie Consent Tool">
          <Paragraph>
            When you first visit our website, you can choose which types of cookies to accept through our cookie consent banner.
          </Paragraph>
        </Subsection>

        <Subsection title="5.3 Opt-Out Links">
          <Paragraph>
            You can opt out of certain third-party cookies:
          </Paragraph>
          <List items={[
            'Google Analytics: https://tools.google.com/dlpage/gaoptout',
            'Network Advertising Initiative: https://optout.networkadvertising.org',
            'Digital Advertising Alliance: https://optout.aboutads.info'
          ]} />
        </Subsection>
      </Section>

      <Section title="6. Impact of Disabling Cookies">
        <Paragraph>
          If you disable cookies, some features of our Service may not function properly. You may experience:
        </Paragraph>
        <List items={[
          'Difficulty staying logged in',
          'Loss of personalized settings',
          'Reduced website functionality',
          'Less relevant advertising',
          'Inability to use certain features'
        ]} />
      </Section>

      <Section title="7. Cookie Duration">
        <Paragraph>
          Cookies may be either "session" cookies or "persistent" cookies:
        </Paragraph>
        <List items={[
          'Session Cookies: Deleted when you close your browser',
          'Persistent Cookies: Remain on your device for a set period or until you delete them'
        ]} />
      </Section>

      <Section title="8. Updates to This Policy">
        <Paragraph>
          We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </Paragraph>
      </Section>

      <Section title="9. Contact Us">
        <Paragraph>
          If you have any questions about our use of cookies, please contact us:
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
