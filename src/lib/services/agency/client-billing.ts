/**
 * Client Billing Module for Agency OS
 * Manages client invoicing and payment tracking
 */

import { prisma } from '@/lib/prisma';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'BANK_TRANSFER' | 'CREDIT_CARD' | 'PAYPAL' | 'CRYPTO' | 'CHECK' | 'OTHER';

export interface LineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    taxRate?: number;
}

export interface ClientInvoice {
    id: string;
    clientId: string;
    clientName: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    lineItems: LineItem[];
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    currency: string;
    notes?: string;
    paymentTerms?: string;
    paidAt?: Date;
    paymentMethod?: PaymentMethod;
}

export interface PaymentRecord {
    id: string;
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    receivedAt: Date;
    notes?: string;
}

export interface ClientBillingStats {
    totalRevenue: number;
    totalOutstanding: number;
    totalOverdue: number;
    invoiceCount: number;
    paidCount: number;
    overdueCount: number;
    averagePaymentDays: number;
    topClients: Array<{ clientId: string; clientName: string; revenue: number }>;
}

/**
 * Generate unique invoice number
 */
export function generateInvoiceNumber(prefix = 'INV'): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${year}${month}-${random}`;
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(lineItems: LineItem[], discountPercent = 0): {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
} {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = lineItems.reduce((sum, item) => {
        return sum + (item.total * (item.taxRate || 0) / 100);
    }, 0);
    const discountAmount = subtotal * (discountPercent / 100);
    const total = subtotal + taxAmount - discountAmount;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        discountAmount: Math.round(discountAmount * 100) / 100,
        total: Math.round(total * 100) / 100,
    };
}

/**
 * Check if invoice is overdue
 */
export function isOverdue(invoice: Pick<ClientInvoice, 'status' | 'dueDate'>): boolean {
    if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
        return false;
    }
    return new Date() > new Date(invoice.dueDate);
}

/**
 * Format currency with proper symbol
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    });
    return formatter.format(amount);
}

/**
 * Get billing statistics for agency
 */
export async function getAgencyBillingStats(agencyId: string): Promise<ClientBillingStats> {
    // This would query from a ClientInvoice table
    // For now, returning mock structure
    return {
        totalRevenue: 0,
        totalOutstanding: 0,
        totalOverdue: 0,
        invoiceCount: 0,
        paidCount: 0,
        overdueCount: 0,
        averagePaymentDays: 0,
        topClients: [],
    };
}

/**
 * Invoice email templates
 */
export const INVOICE_EMAIL_TEMPLATES = {
    SENT: {
        subject: 'Invoice #{invoiceNumber} from {agencyName}',
        body: `
Dear {clientName},

Please find attached Invoice #{invoiceNumber} for {total}.

Due Date: {dueDate}

Payment Terms: {paymentTerms}

If you have any questions, please don't hesitate to reach out.

Best regards,
{agencyName}
    `.trim()
    },
    REMINDER: {
        subject: 'Reminder: Invoice #{invoiceNumber} Due Soon',
        body: `
Dear {clientName},

This is a friendly reminder that Invoice #{invoiceNumber} for {total} is due on {dueDate}.

Please arrange payment at your earliest convenience.

Best regards,
{agencyName}
    `.trim()
    },
    OVERDUE: {
        subject: 'Overdue: Invoice #{invoiceNumber}',
        body: `
Dear {clientName},

Invoice #{invoiceNumber} for {total} was due on {dueDate} and remains unpaid.

Please arrange payment immediately to avoid any service interruptions.

If you've already made payment, please disregard this notice.

Best regards,
{agencyName}
    `.trim()
    },
    THANK_YOU: {
        subject: 'Thank You for Your Payment - Invoice #{invoiceNumber}',
        body: `
Dear {clientName},

Thank you for your payment of {total} for Invoice #{invoiceNumber}.

We appreciate your business and look forward to continuing our partnership.

Best regards,
{agencyName}
    `.trim()
    }
};

export default {
    generateInvoiceNumber,
    calculateInvoiceTotals,
    isOverdue,
    formatCurrency,
    getAgencyBillingStats,
    INVOICE_EMAIL_TEMPLATES,
};
