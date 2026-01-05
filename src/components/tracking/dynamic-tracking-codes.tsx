'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface TrackingCode {
  id: string;
  name: string;
  code: string;
  type: string;
  position: string;
}

interface DynamicTrackingCodesProps {
  position: 'HEAD' | 'BODY_START' | 'BODY_END';
}

export function DynamicTrackingCodes({ position }: DynamicTrackingCodesProps) {
  const [trackingCodes, setTrackingCodes] = useState<TrackingCode[]>([]);

  useEffect(() => {
    const fetchTrackingCodes = async () => {
      try {
        const response = await fetch('/api/tracking-codes/active');
        const data = await response.json();
        
        if (response.ok) {
          const filteredCodes = data.trackingCodes.filter(
            (code: TrackingCode) => code.position === position
          );
          setTrackingCodes(filteredCodes);
        }
      } catch (error) {
        console.error('Error fetching tracking codes:', error);
      }
    };

    fetchTrackingCodes();
  }, [position]);

  if (trackingCodes.length === 0) {
    return null;
  }

  return (
    <>
      {trackingCodes.map((code) => (
        <div
          key={code.id}
          dangerouslySetInnerHTML={{ __html: code.code }}
        />
      ))}
    </>
  );
}

