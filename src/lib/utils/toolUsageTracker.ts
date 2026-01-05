import { ToolCategory, ToolUsageLimit } from '@/types/tools';

export async function trackToolUsage(
  toolId: string,
  toolName: string,
  category: ToolCategory,
  metadata?: any
): Promise<void> {
  try {
    await fetch('/api/tools/track-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, toolName, category, metadata })
    });
  } catch (error) {
    console.error('Failed to track tool usage:', error);
  }
}

export async function checkUsageLimit(toolId: string): Promise<ToolUsageLimit> {
  try {
    const res = await fetch(`/api/tools/check-limit?toolId=${toolId}`);
    if (!res.ok) {
      throw new Error('Failed to check usage limit');
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to check usage limit:', error);
    // Return default values on error
    return { 
      canUse: true, 
      remaining: 10, 
      limit: 10, 
      isPro: false, 
      usedToday: 0 
    };
  }
}

export async function getToolStats(toolId?: string): Promise<{
  totalUses: number;
  uniqueUsers: number;
  avgUsesPerUser: number;
  topTools?: Array<{ toolId: string; toolName: string; count: number }>;
}> {
  try {
    const url = toolId 
      ? `/api/tools/get-stats?toolId=${toolId}`
      : '/api/tools/get-stats';
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to get tool stats');
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to get tool stats:', error);
    return {
      totalUses: 0,
      uniqueUsers: 0,
      avgUsesPerUser: 0
    };
  }
}

