export type EmailClient = 'gmail' | 'outlook' | 'apple' | 'mobile';

export interface EmailPreviewData {
  subject: string;
  preheader: string;
  from: string;
}

export function generateEmailPreview(data: EmailPreviewData, client: EmailClient): string {
  switch (client) {
    case 'gmail':
      return generateGmailPreview(data);
    case 'outlook':
      return generateOutlookPreview(data);
    case 'apple':
      return generateAppleMailPreview(data);
    case 'mobile':
      return generateMobilePreview(data);
    default:
      return generateGmailPreview(data);
  }
}

function generateGmailPreview(data: EmailPreviewData): string {
  return `
<div style="font-family: 'Roboto', Arial, sans-serif; max-width: 600px; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
  <div style="padding: 16px; border-bottom: 1px solid #e0e0e0;">
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
      <div style="width: 40px; height: 40px; border-radius: 50%; background: #4285f4; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px;">
        ${data.from.charAt(0).toUpperCase()}
      </div>
      <div>
        <div style="font-size: 14px; font-weight: 500; color: #202124;">${data.from}</div>
        <div style="font-size: 12px; color: #5f6368;">to me</div>
      </div>
    </div>
    <div style="font-size: 20px; font-weight: 400; color: #202124; margin-bottom: 4px;">${data.subject}</div>
    <div style="font-size: 14px; color: #5f6368;">${data.preheader}</div>
  </div>
  <div style="padding: 16px; color: #202124; font-size: 14px; line-height: 1.5;">
    [Email content appears here]
  </div>
</div>
  `.trim();
}

function generateOutlookPreview(data: EmailPreviewData): string {
  return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; background: #fff; border: 1px solid #d1d1d1;">
  <div style="padding: 12px 16px; background: #f3f2f1; border-bottom: 1px solid #d1d1d1;">
    <div style="font-size: 18px; font-weight: 600; color: #323130; margin-bottom: 4px;">${data.subject}</div>
    <div style="font-size: 13px; color: #605e5c; margin-bottom: 8px;">
      <strong>${data.from}</strong>
    </div>
    <div style="font-size: 12px; color: #8a8886;">${data.preheader}</div>
  </div>
  <div style="padding: 16px; color: #323130; font-size: 14px; line-height: 1.5;">
    [Email content appears here]
  </div>
</div>
  `.trim();
}

function generateAppleMailPreview(data: EmailPreviewData): string {
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; background: #fff; border: 1px solid #d1d1d1; border-radius: 6px; overflow: hidden;">
  <div style="padding: 16px; background: #f5f5f7; border-bottom: 1px solid #d1d1d1;">
    <div style="font-size: 22px; font-weight: 600; color: #1d1d1f; margin-bottom: 8px;">${data.subject}</div>
    <div style="font-size: 14px; color: #86868b; margin-bottom: 4px;">From: ${data.from}</div>
    <div style="font-size: 13px; color: #86868b;">${data.preheader}</div>
  </div>
  <div style="padding: 20px; color: #1d1d1f; font-size: 15px; line-height: 1.6;">
    [Email content appears here]
  </div>
</div>
  `.trim();
}

function generateMobilePreview(data: EmailPreviewData): string {
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Roboto', Arial, sans-serif; max-width: 375px; background: #fff; border: 1px solid #e0e0e0;">
  <div style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
    <div style="font-size: 16px; font-weight: 600; color: #000; margin-bottom: 4px;">${data.from}</div>
    <div style="font-size: 15px; font-weight: 500; color: #000; margin-bottom: 2px;">${data.subject}</div>
    <div style="font-size: 13px; color: #8e8e93;">${data.preheader}</div>
  </div>
  <div style="padding: 12px; color: #000; font-size: 14px; line-height: 1.5;">
    [Email content appears here]
  </div>
</div>
  `.trim();
}

