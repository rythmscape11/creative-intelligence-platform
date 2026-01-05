export interface SignatureData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  linkedin?: string;
  twitter?: string;
}

export type SignatureTemplate = 'professional' | 'modern' | 'minimal' | 'creative';

export function generateEmailSignature(data: SignatureData, template: SignatureTemplate): string {
  switch (template) {
    case 'professional':
      return generateProfessionalSignature(data);
    case 'modern':
      return generateModernSignature(data);
    case 'minimal':
      return generateMinimalSignature(data);
    case 'creative':
      return generateCreativeSignature(data);
    default:
      return generateProfessionalSignature(data);
  }
}

function generateProfessionalSignature(data: SignatureData): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
  <tr>
    <td style="padding-bottom: 10px;">
      <strong style="font-size: 16px; color: #F59E0B;">${data.name}</strong><br>
      <span style="color: #666;">${data.title}</span><br>
      <span style="color: #666;">${data.company}</span>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 10px; border-top: 2px solid #F59E0B;">
      <a href="mailto:${data.email}" style="color: #F59E0B; text-decoration: none;">📧 ${data.email}</a><br>
      <span style="color: #666;">📱 ${data.phone}</span><br>
      <a href="${data.website}" style="color: #F59E0B; text-decoration: none;">🌐 ${data.website}</a>
    </td>
  </tr>
  ${data.linkedin || data.twitter ? `
  <tr>
    <td style="padding-top: 10px;">
      ${data.linkedin ? `<a href="${data.linkedin}" style="color: #0077b5; text-decoration: none; margin-right: 10px;">LinkedIn</a>` : ''}
      ${data.twitter ? `<a href="${data.twitter}" style="color: #1da1f2; text-decoration: none;">Twitter</a>` : ''}
    </td>
  </tr>
  ` : ''}
</table>
  `.trim();
}

function generateModernSignature(data: SignatureData): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px;">
  <tr>
    <td style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <strong style="font-size: 18px; color: #fff;">${data.name}</strong><br>
            <span style="color: #e0e7ff; font-size: 13px;">${data.title} at ${data.company}</span>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 15px;">
            <a href="mailto:${data.email}" style="color: #fff; text-decoration: none; font-size: 13px;">${data.email}</a><br>
            <span style="color: #e0e7ff; font-size: 13px;">${data.phone}</span><br>
            <a href="${data.website}" style="color: #fff; text-decoration: none; font-size: 13px;">${data.website}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `.trim();
}

function generateMinimalSignature(data: SignatureData): string {
  return `
<div style="font-family: 'Courier New', monospace; font-size: 13px; color: #1a1a1a;">
  <strong>${data.name}</strong> | ${data.title}<br>
  ${data.company}<br>
  <a href="mailto:${data.email}" style="color: #1a1a1a;">${data.email}</a> | ${data.phone}<br>
  <a href="${data.website}" style="color: #1a1a1a;">${data.website}</a>
</div>
  `.trim();
}

function generateCreativeSignature(data: SignatureData): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Georgia', serif; font-size: 14px;">
  <tr>
    <td style="padding: 15px; border-left: 4px solid #f59e0b; background: #fffbeb;">
      <div style="margin-bottom: 10px;">
        <strong style="font-size: 20px; color: #92400e;">${data.name}</strong><br>
        <em style="color: #b45309;">${data.title}</em><br>
        <span style="color: #18181B;">${data.company}</span>
      </div>
      <div style="color: #78350f;">
        <a href="mailto:${data.email}" style="color: #92400e; text-decoration: none;">${data.email}</a> • ${data.phone}<br>
        <a href="${data.website}" style="color: #92400e; text-decoration: none;">${data.website}</a>
      </div>
    </td>
  </tr>
</table>
  `.trim();
}

