'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export function BackButton({ 
  href, 
  label = 'Back', 
  className = '',
  variant = 'ghost'
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {label}
    </Button>
  );
}

