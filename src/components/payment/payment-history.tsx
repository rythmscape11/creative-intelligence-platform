'use client';

/**
 * Payment History Component
 * 
 * Displays user's payment history with pagination.
 */

import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Payment {
  id: string;
  stripePaymentId: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  invoice: {
    invoiceNumber: string;
    pdfUrl: string | null;
  } | null;
}

interface PaymentHistoryProps {
  limit?: number;
  showAllUsers?: boolean; // Admin only - show all users' payments
}

export function PaymentHistory({ limit = 10 }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit,
    offset: 0,
    hasMore: false,
  });

  useEffect(() => {
    fetchPayments(0);
  }, []);

  const fetchPayments = async (offset: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/payments?limit=${limit}&offset=${offset}`);

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data.payments);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchPayments(pagination.offset + pagination.limit);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return 'bg-green-100/30 text-green-800';
      case 'FAILED':
        return 'bg-red-100/30 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100/30 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <CreditCardIcon className="h-12 w-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-600">No payment history yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Payment History
        </h2>
        <p className="text-sm text-gray-700 mt-1">
          {pagination.total} {pagination.total === 1 ? 'payment' : 'payments'} total
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {payment.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatAmount(payment.amount, payment.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{payment.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {payment.invoice?.pdfUrl ? (
                    <a
                      href={payment.invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-amber-600 hover:text-amber-700"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  ) : (
                    <span className="text-gray-700">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {pagination.hasMore && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

// Missing import
import { CreditCardIcon } from '@heroicons/react/24/outline';

