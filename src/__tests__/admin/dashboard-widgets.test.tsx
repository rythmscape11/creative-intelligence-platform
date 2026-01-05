import { render, screen } from '@testing-library/react';
import { DashboardCharts } from '@/components/admin/dashboard-charts';
import { describe, it, expect, vi } from 'vitest';

// Mock Recharts since it relies on browser APIs (ResizeObserver)
vi.mock('recharts', () => {
    const OriginalModule = vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div className="recharts-responsive-container" style={{ width: 800, height: 800 }}>
                {children}
            </div>
        ),
        AreaChart: () => <div data-testid="area-chart" />,
        BarChart: () => <div data-testid="bar-chart" />,
        Area: () => null,
        Bar: () => null,
        XAxis: () => null,
        YAxis: () => null,
        CartesianGrid: () => null,
        Tooltip: () => null,
    };
});

describe('DashboardCharts', () => {
    const mockUserGrowthData = [
        { date: 'Jan 1', count: 10 },
        { date: 'Jan 2', count: 15 },
    ];

    const mockActivityData = [
        { date: 'Mon', count: 5 },
        { date: 'Tue', count: 8 },
    ];

    it('renders both charts', () => {
        render(
            <DashboardCharts
                userGrowthData={mockUserGrowthData}
                activityData={mockActivityData}
            />
        );

        expect(screen.getByText('User Growth (Last 30 Days)')).toBeInTheDocument();
        expect(screen.getByText('Activity Trends (Last 7 Days)')).toBeInTheDocument();
        expect(screen.getByTestId('area-chart')).toBeInTheDocument();
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
});
