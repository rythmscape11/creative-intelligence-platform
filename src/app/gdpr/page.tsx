import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { LegalPageLayout, Section, Paragraph, List, InfoBox } from '@/components/legal/legal-page-layout';

export const metadata: Metadata = {
  title: 'GDPR Compliance | Aureon One',
  description: 'Aureon One is fully GDPR compliant. Learn about your data rights, how we protect your information, and our commitment to data privacy.',
  alternates: {
    canonical: '/gdpr',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GDPRPage() {
  return (
    <LegalPageLayout
      title="GDPR Compliance"
      lastUpdated="General Data Protection Regulation"
      icon={<ShieldCheck className="h-8 w-8 text-[#F59E0B]" />}
    >
      <Section title="Our Commitment to GDPR">
        <Paragraph>
          Aureon One is committed to protecting the privacy and security of your personal data in accordance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
        </Paragraph>
      </Section>

      <Section title="Your Rights Under GDPR">
        <Paragraph>
          As a data subject, you have the following rights:
        </Paragraph>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InfoBox
            title="Right to Access"
            description="Request a copy of your personal data we hold"
          />
          <InfoBox
            title="Right to Rectification"
            description="Correct inaccurate or incomplete data"
          />
          <InfoBox
            title="Right to Erasure"
            description="Request deletion of your personal data"
          />
          <InfoBox
            title="Right to Restriction"
            description="Limit how we use your data"
          />
          <InfoBox
            title="Right to Portability"
            description="Receive your data in a portable format"
          />
          <InfoBox
            title="Right to Object"
            description="Object to certain data processing"
          />
        </div>
      </Section>

      <Section title="How to Exercise Your Rights">
        <Paragraph>
          To exercise any of your GDPR rights, please contact us at hello@aureonone.in. We will respond to your request within 30 days.
        </Paragraph>
        <Paragraph>
          When making a request, please provide:
        </Paragraph>
        <List items={[
          'Your full name and email address',
          'A description of the right you wish to exercise',
          'Any relevant details or documentation',
          'Proof of identity (if required)'
        ]} />
      </Section>

      <Section title="Legal Basis for Processing">
        <Paragraph>
          We process your personal data based on the following legal grounds:
        </Paragraph>
        <List items={[
          'Consent: You have given clear consent for us to process your data',
          'Contract: Processing is necessary to fulfill our contract with you',
          'Legal Obligation: Processing is required by law',
          'Legitimate Interests: Processing is necessary for our legitimate business interests'
        ]} />
      </Section>

      <Section title="Data Protection Measures">
        <Paragraph>
          We implement comprehensive security measures to protect your data:
        </Paragraph>
        <List items={[
          'Encryption of data in transit and at rest',
          'Regular security audits and assessments',
          'Access controls and authentication',
          'Employee training on data protection',
          'Incident response and breach notification procedures',
          'Data minimization and purpose limitation',
          'Regular backups and disaster recovery plans'
        ]} />
      </Section>

      <Section title="Data Retention">
        <Paragraph>
          We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by law. Our retention periods are:
        </Paragraph>
        <List items={[
          'Account Data: Retained while your account is active',
          'Marketing Data: Retained until you unsubscribe',
          'Transaction Data: Retained for 7 years (legal requirement)',
          'Support Data: Retained for 3 years after resolution',
          'Analytics Data: Anonymized after 26 months'
        ]} />
      </Section>

      <Section title="International Data Transfers">
        <Paragraph>
          If we transfer your data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place:
        </Paragraph>
        <List items={[
          'Standard Contractual Clauses (SCCs)',
          'Adequacy decisions by the European Commission',
          'Binding Corporate Rules (BCRs)',
          'Certification schemes (e.g., Privacy Shield successor)'
        ]} />
      </Section>

      <Section title="Data Protection Officer">
        <Paragraph>
          We have appointed a Data Protection Officer (DPO) to oversee our GDPR compliance. You can contact our DPO at:
        </Paragraph>
        <List items={[
          'Email: dpo@aureonone.in',
          'Address: Data Protection Officer, Aureon One, 123 Marketing Street, San Francisco, CA 94102, United States'
        ]} />
      </Section>

      <Section title="Supervisory Authority">
        <Paragraph>
          You have the right to lodge a complaint with a supervisory authority if you believe we have violated your data protection rights. In the EU, you can contact your local data protection authority.
        </Paragraph>
      </Section>

      <Section title="Children's Data">
        <Paragraph>
          We do not knowingly collect or process personal data from children under 16 years of age without parental consent. If you believe we have collected data from a child, please contact us immediately.
        </Paragraph>
      </Section>

      <Section title="Automated Decision-Making">
        <Paragraph>
          We may use automated decision-making, including profiling, to:
        </Paragraph>
        <List items={[
          'Personalize your experience',
          'Recommend relevant content',
          'Detect fraud and security threats',
          'Optimize our services'
        ]} />
        <Paragraph>
          You have the right to object to automated decision-making and request human intervention.
        </Paragraph>
      </Section>

      <Section title="Updates to This Policy">
        <Paragraph>
          We may update this GDPR Compliance page from time to time. We will notify you of any material changes by email or through a prominent notice on our website.
        </Paragraph>
      </Section>

      <Section title="Contact Us">
        <Paragraph>
          If you have any questions about our GDPR compliance or data protection practices, please contact us:
        </Paragraph>
        <List items={[
          'Email: hello@aureonone.in',
          'DPO Email: hello@aureonone.in',
          'Website: www.aureonone.in',
          'Address: 123 Marketing Street, San Francisco, CA 94102, United States'
        ]} />
      </Section>
    </LegalPageLayout>
  );
}
