import jsPDF from 'jspdf';

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function exportToPDF(data: {
  title: string;
  content: string;
  metadata?: Record<string, any>;
}) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text(data.title, 20, 20);
  
  // Metadata
  if (data.metadata) {
    doc.setFontSize(10);
    let yPos = 35;
    Object.entries(data.metadata).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, yPos);
      yPos += 7;
    });
  }
  
  // Content
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(data.content, 170);
  doc.text(lines, 20, data.metadata ? 60 : 40);
  
  // Download
  doc.save(`${data.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(h => {
        const value = row[h];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateQRCode(text: string, size: number = 200): string {
  // Simple QR code generation using a data URL
  // For production, consider using a library like qrcode
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Simple placeholder - in production use proper QR library
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000000';
  ctx.font = '12px monospace';
  ctx.fillText('QR Code', 10, size / 2);
  
  return canvas.toDataURL();
}

