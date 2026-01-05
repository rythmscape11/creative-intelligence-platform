import { NextRequest, NextResponse } from 'next/server';
import { MonitoringService } from '@/lib/services/monitoring-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const monitoring = MonitoringService.getInstance();

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Perform health checks
    const checks: Record<string, any> = {};

    // 1. Database health check
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = {
        status: 'healthy',
        message: 'Database connection successful',
      };
    } catch (error) {
      checks.database = {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Database connection failed',
      };
      monitoring.captureError(error as Error, {
        extra: { check: 'database' },
      });
    }

    // 2. Memory health check
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memoryUsage = process.memoryUsage();
      const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
      
      checks.memory = {
        status: heapUsedPercent < 90 ? 'healthy' : 'degraded',
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsedPercent: `${heapUsedPercent.toFixed(2)}%`,
      };
    }

    // 3. Uptime check
    if (typeof process !== 'undefined' && process.uptime) {
      const uptime = process.uptime();
      checks.uptime = {
        status: 'healthy',
        seconds: uptime,
        formatted: formatUptime(uptime),
      };
    }

    // 4. Environment check
    checks.environment = {
      status: 'healthy',
      nodeEnv: process.env.NODE_ENV,
      nodeVersion: process.version,
    };

    // 5. External services check (optional)
    if (process.env.OPENAI_API_KEY) {
      checks.openai = {
        status: 'configured',
        message: 'OpenAI API key is configured',
      };
    }

    if (process.env.AWS_ACCESS_KEY_ID) {
      checks.aws = {
        status: 'configured',
        message: 'AWS credentials are configured',
      };
    }

    // Determine overall health status
    const allHealthy = Object.values(checks).every(
      check => check.status === 'healthy' || check.status === 'configured'
    );
    const someUnhealthy = Object.values(checks).some(
      check => check.status === 'unhealthy'
    );

    const overallStatus = someUnhealthy ? 'unhealthy' : 
                         allHealthy ? 'healthy' : 'degraded';

    const duration = Date.now() - startTime;

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      checks,
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
    };

    // Return appropriate status code
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(response, { status: statusCode });

  } catch (error) {
    monitoring.captureError(error as Error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
    }, { status: 503 });
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}
