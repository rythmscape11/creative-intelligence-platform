import { NextRequest, NextResponse } from 'next/server';
import { MonitoringService } from '@/lib/services/monitoring-service';

const monitoring = MonitoringService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Collect system metrics
    const metrics: Record<string, any> = {};

    // Memory metrics
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memoryUsage = process.memoryUsage();
      metrics.memory = {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        rss: memoryUsage.rss,
        external: memoryUsage.external,
      };
    }

    // CPU metrics (if available)
    if (typeof process !== 'undefined' && process.cpuUsage) {
      const cpuUsage = process.cpuUsage();
      metrics.cpu = {
        user: cpuUsage.user,
        system: cpuUsage.system,
      };
    }

    // Uptime
    if (typeof process !== 'undefined' && process.uptime) {
      metrics.uptime = process.uptime();
    }

    // Event loop lag (simplified)
    const eventLoopStart = Date.now();
    await new Promise(resolve => setImmediate(resolve));
    const eventLoopLag = Date.now() - eventLoopStart;
    metrics.eventLoopLag = eventLoopLag;

    // Return metrics in requested format
    if (format === 'prometheus') {
      // Prometheus format
      const prometheusMetrics = convertToPrometheus(metrics);
      return new NextResponse(prometheusMetrics, {
        headers: {
          'Content-Type': 'text/plain; version=0.0.4',
        },
      });
    }

    // Default JSON format
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics,
    });

  } catch (error) {
    monitoring.captureError(error as Error);
    
    return NextResponse.json({
      error: 'Failed to collect metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, unit, tags } = body;

    if (!name || value === undefined) {
      return NextResponse.json({
        error: 'Missing required fields: name and value',
      }, { status: 400 });
    }

    // Record the metric
    monitoring.recordMetric({
      name,
      value,
      unit: unit || 'count',
      tags,
    });

    return NextResponse.json({
      success: true,
      message: 'Metric recorded successfully',
    });

  } catch (error) {
    monitoring.captureError(error as Error);
    
    return NextResponse.json({
      error: 'Failed to record metric',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

function convertToPrometheus(metrics: Record<string, any>): string {
  const lines: string[] = [];

  // Memory metrics
  if (metrics.memory) {
    lines.push('# HELP nodejs_heap_used_bytes Node.js heap used in bytes');
    lines.push('# TYPE nodejs_heap_used_bytes gauge');
    lines.push(`nodejs_heap_used_bytes ${metrics.memory.heapUsed}`);
    
    lines.push('# HELP nodejs_heap_total_bytes Node.js heap total in bytes');
    lines.push('# TYPE nodejs_heap_total_bytes gauge');
    lines.push(`nodejs_heap_total_bytes ${metrics.memory.heapTotal}`);
    
    lines.push('# HELP nodejs_rss_bytes Node.js RSS in bytes');
    lines.push('# TYPE nodejs_rss_bytes gauge');
    lines.push(`nodejs_rss_bytes ${metrics.memory.rss}`);
  }

  // CPU metrics
  if (metrics.cpu) {
    lines.push('# HELP nodejs_cpu_user_microseconds Node.js CPU user time in microseconds');
    lines.push('# TYPE nodejs_cpu_user_microseconds counter');
    lines.push(`nodejs_cpu_user_microseconds ${metrics.cpu.user}`);
    
    lines.push('# HELP nodejs_cpu_system_microseconds Node.js CPU system time in microseconds');
    lines.push('# TYPE nodejs_cpu_system_microseconds counter');
    lines.push(`nodejs_cpu_system_microseconds ${metrics.cpu.system}`);
  }

  // Uptime
  if (metrics.uptime !== undefined) {
    lines.push('# HELP nodejs_uptime_seconds Node.js uptime in seconds');
    lines.push('# TYPE nodejs_uptime_seconds gauge');
    lines.push(`nodejs_uptime_seconds ${metrics.uptime}`);
  }

  // Event loop lag
  if (metrics.eventLoopLag !== undefined) {
    lines.push('# HELP nodejs_eventloop_lag_milliseconds Event loop lag in milliseconds');
    lines.push('# TYPE nodejs_eventloop_lag_milliseconds gauge');
    lines.push(`nodejs_eventloop_lag_milliseconds ${metrics.eventLoopLag}`);
  }

  return lines.join('\n') + '\n';
}
