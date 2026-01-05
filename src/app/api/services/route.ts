import { NextRequest, NextResponse } from 'next/server';
import { ALL_SERVICES, getServicesByCategory, getPopularServices, ServiceCategory } from '@/config/services';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * GET /api/services
 * 
 * Get all services or filter by category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as ServiceCategory | null;
    const popular = searchParams.get('popular') === 'true';

    let services = ALL_SERVICES;

    if (popular) {
      services = getPopularServices();
    } else if (category) {
      services = getServicesByCategory(category);
    }

    return NextResponse.json({
      success: true,
      services,
      count: services.length,
    });
  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
