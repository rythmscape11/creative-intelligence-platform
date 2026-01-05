/**
 * Manual Invoice Generator API
 * 
 * Admin-only endpoint to generate invoices for enterprise deals.
 * Creates PDF invoice and stores in S3.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface InvoiceRequest {
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
    }[];
    notes?: string;
    dueDate?: string;
    currency?: 'USD' | 'INR';
}

/**
 * POST - Generate a manual invoice
 */
export async function POST(request: NextRequest) {
    try {
        const { userId: adminId } = await auth();

        if (!adminId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify admin role
        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            select: { role: true, email: true },
        });

        if (!admin || admin.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        const body: InvoiceRequest = await request.json();
        const { clientName, clientEmail, clientAddress, items, notes, dueDate, currency = 'USD' } = body;

        if (!clientName || !clientEmail || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields: clientName, clientEmail, items' },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const tax = currency === 'INR' ? subtotal * 0.18 : 0; // 18% GST for INR
        const total = subtotal + tax;

        // Generate invoice number
        const invoiceCount = await prisma.userActivity.count({
            where: { action: 'admin:invoice:generated' },
        });
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

        // Create invoice record
        const invoiceData = {
            invoiceNumber,
            clientName,
            clientEmail,
            clientAddress,
            items,
            subtotal,
            tax,
            total,
            currency,
            notes,
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            generatedAt: new Date().toISOString(),
            generatedBy: admin.email,
        };

        // Log the action
        await prisma.userActivity.create({
            data: {
                userId: adminId,
                action: 'admin:invoice:generated',
                entityType: 'invoice',
                entityId: invoiceNumber,
                details: JSON.stringify(invoiceData),
            },
        });

        // Generate HTML invoice (can be converted to PDF client-side or via external service)
        const invoiceHtml = generateInvoiceHtml(invoiceData);

        return NextResponse.json({
            success: true,
            invoice: {
                ...invoiceData,
                html: invoiceHtml,
            },
        });
    } catch (error) {
        console.error('Invoice generation failed:', error);
        return NextResponse.json(
            { error: 'Failed to generate invoice' },
            { status: 500 }
        );
    }
}

/**
 * GET - List generated invoices
 */
export async function GET() {
    try {
        const { userId: adminId } = await auth();

        if (!adminId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const admin = await prisma.user.findUnique({
            where: { id: adminId },
            select: { role: true },
        });

        if (!admin || admin.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const invoices = await prisma.userActivity.findMany({
            where: { action: 'admin:invoice:generated' },
            orderBy: { timestamp: 'desc' },
            take: 100,
        });

        return NextResponse.json({
            invoices: invoices.map((inv) => {
                const details = JSON.parse(inv.details || '{}');
                return {
                    id: inv.id,
                    invoiceNumber: details.invoiceNumber,
                    clientName: details.clientName,
                    clientEmail: details.clientEmail,
                    total: details.total,
                    currency: details.currency,
                    generatedAt: details.generatedAt,
                    dueDate: details.dueDate,
                };
            }),
        });
    } catch (error) {
        console.error('Failed to list invoices:', error);
        return NextResponse.json(
            { error: 'Failed to list invoices' },
            { status: 500 }
        );
    }
}

/**
 * Generate HTML invoice template
 */
function generateInvoiceHtml(invoice: Record<string, unknown>): string {
    const items = invoice.items as { description: string; quantity: number; unitPrice: number }[];
    const currencySymbol = invoice.currency === 'INR' ? '₹' : '$';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
    .invoice-info { text-align: right; }
    .invoice-number { font-size: 20px; font-weight: bold; }
    .client-info { margin-bottom: 30px; }
    .client-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .client-name { font-size: 18px; font-weight: bold; margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .amount { text-align: right; }
    .totals { margin-top: 20px; text-align: right; }
    .totals-row { display: flex; justify-content: flex-end; margin: 5px 0; }
    .totals-label { width: 150px; color: #666; }
    .totals-value { width: 100px; font-weight: bold; }
    .grand-total { font-size: 18px; color: #6366f1; border-top: 2px solid #6366f1; padding-top: 10px; margin-top: 10px; }
    .notes { margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .notes-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 10px; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Aureon One</div>
    <div class="invoice-info">
      <div class="invoice-number">${invoice.invoiceNumber}</div>
      <div>Date: ${new Date(invoice.generatedAt as string).toLocaleDateString()}</div>
      <div>Due: ${new Date(invoice.dueDate as string).toLocaleDateString()}</div>
    </div>
  </div>
  
  <div class="client-info">
    <div class="client-label">Bill To</div>
    <div class="client-name">${invoice.clientName}</div>
    <div>${invoice.clientEmail}</div>
    ${invoice.clientAddress ? `<div>${invoice.clientAddress}</div>` : ''}
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th class="amount">Unit Price</th>
        <th class="amount">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td class="amount">${currencySymbol}${item.unitPrice.toLocaleString()}</td>
          <td class="amount">${currencySymbol}${(item.quantity * item.unitPrice).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="totals">
    <div class="totals-row">
      <span class="totals-label">Subtotal</span>
      <span class="totals-value">${currencySymbol}${(invoice.subtotal as number).toLocaleString()}</span>
    </div>
    ${(invoice.tax as number) > 0 ? `
    <div class="totals-row">
      <span class="totals-label">GST (18%)</span>
      <span class="totals-value">${currencySymbol}${(invoice.tax as number).toLocaleString()}</span>
    </div>
    ` : ''}
    <div class="totals-row grand-total">
      <span class="totals-label">Total</span>
      <span class="totals-value">${currencySymbol}${(invoice.total as number).toLocaleString()}</span>
    </div>
  </div>
  
  ${invoice.notes ? `
  <div class="notes">
    <div class="notes-label">Notes</div>
    <div>${invoice.notes}</div>
  </div>
  ` : ''}
  
  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Aureon One | AI Marketing OS | support@aureonone.com</p>
  </div>
</body>
</html>
  `.trim();
}
