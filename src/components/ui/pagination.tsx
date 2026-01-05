import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}?page=${page}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
          ${
            currentPage > 1
              ? 'border-[#2A2A2A] bg-[#1A1A1A] text-gray-300 hover:bg-[#2A2A2A] hover:border-[#3A3A3A]'
              : 'border-[#2A2A2A] bg-[#0F0F0F] text-gray-600 cursor-not-allowed'
          }
        `}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : 0}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={`
                min-w-[40px] px-3 py-2 rounded-lg text-center transition-colors
                ${
                  isActive
                    ? 'bg-[#F59E0B] text-[#0A0A0A] font-semibold'
                    : 'bg-[#1A1A1A] text-gray-300 border border-[#2A2A2A] hover:bg-[#2A2A2A] hover:border-[#3A3A3A]'
                }
              `}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
          ${
            currentPage < totalPages
              ? 'border-[#2A2A2A] bg-[#1A1A1A] text-gray-300 hover:bg-[#2A2A2A] hover:border-[#3A3A3A]'
              : 'border-[#2A2A2A] bg-[#0F0F0F] text-gray-600 cursor-not-allowed'
          }
        `}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : 0}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon className="h-5 w-5" />
      </Link>

      {/* Page Info */}
      <div className="hidden md:flex items-center ml-4 text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
}

