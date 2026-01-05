/**
 * Forge Execution Service
 * Handles flow execution, job queuing, and node processing
 */

import { prisma } from '@/lib/prisma';
import { ForgeFlowService, FlowDefinition, FlowNode } from './forge-flow.service';

export type RunStatus = 'queued' | 'running' | 'success' | 'failed';
export type NodeStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';
export type TriggerType = 'manual' | 'webhook' | 'scheduled';

export interface ForgeFlowRun {
    id: string;
    flowId: string;
    orgId: string;
    triggeredBy: string | null;
    triggerType: TriggerType;
    inputPayload: Record<string, unknown>;
    status: RunStatus;
    totalSparksUsed: number;
    startedAt: Date | null;
    finishedAt: Date | null;
    createdAt: Date;
}

export interface ForgeFlowRunNode {
    id: string;
    flowRunId: string;
    nodeId: string;
    nodeType: string;
    input: Record<string, unknown> | null;
    output: Record<string, unknown> | null;
    status: NodeStatus;
    sparksUsed: number;
    errorMessage: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
}

export interface QueueFlowRunInput {
    flowId: string;
    orgId: string;
    triggeredBy?: string;
    triggerType: TriggerType;
    inputPayload?: Record<string, unknown>;
}

// Sparks cost per node type (configurable)
const SPARKS_COST: Record<string, number> = {
    trigger: 0,
    llm: 5,
    image: 10,
    video: 50,
    brandguard: 3,
    condition: 0,
    http: 1,
    notification: 1,
};

export class ForgeExecutionService {
    /**
     * Queue a new flow run
     */
    static async queueFlowRun(input: QueueFlowRunInput): Promise<ForgeFlowRun> {
        // Verify flow exists and is published
        const flow = await ForgeFlowService.getByIdAndOrg(input.flowId, input.orgId);
        if (!flow) {
            throw new Error('Flow not found');
        }
        if (flow.status !== 'published') {
            throw new Error('Only published flows can be executed');
        }

        // Create run record
        const run = await prisma.forgeFlowRun.create({
            data: {
                flowId: input.flowId,
                orgId: input.orgId,
                triggeredBy: input.triggeredBy || null,
                triggerType: input.triggerType,
                inputPayload: input.inputPayload || {},
                status: 'queued',
            },
        });

        // Create node records for each node in the flow
        const definition = flow.definitionJson;
        const nodeRecords = definition.nodes.map((node) => ({
            flowRunId: run.id,
            nodeId: node.id,
            nodeType: node.type,
            status: 'pending' as const,
        }));

        await prisma.forgeFlowRunNode.createMany({
            data: nodeRecords,
        });

        // In production, this would push to Bull queue
        // For now, we'll process synchronously in a separate call
        // await this.pushToQueue(run.id);

        return this.toRun(run);
    }

    /**
     * Get run by ID
     */
    static async getRunById(id: string): Promise<ForgeFlowRun | null> {
        const run = await prisma.forgeFlowRun.findUnique({ where: { id } });
        return run ? this.toRun(run) : null;
    }

    /**
     * Get run with node details
     */
    static async getRunWithNodes(
        id: string
    ): Promise<{ run: ForgeFlowRun; nodes: ForgeFlowRunNode[] } | null> {
        const run = await prisma.forgeFlowRun.findUnique({
            where: { id },
            include: { nodes: true },
        });

        if (!run) return null;

        return {
            run: this.toRun(run),
            nodes: run.nodes.map(this.toRunNode),
        };
    }

    /**
     * List runs for a flow
     */
    static async listRunsByFlow(
        flowId: string,
        options?: { limit?: number; offset?: number }
    ): Promise<{ runs: ForgeFlowRun[]; total: number }> {
        const [runs, total] = await Promise.all([
            prisma.forgeFlowRun.findMany({
                where: { flowId },
                orderBy: { createdAt: 'desc' },
                take: options?.limit || 20,
                skip: options?.offset || 0,
            }),
            prisma.forgeFlowRun.count({ where: { flowId } }),
        ]);

        return {
            runs: runs.map(this.toRun),
            total,
        };
    }

    /**
     * List runs for an organization
     */
    static async listRunsByOrg(
        orgId: string,
        options?: { limit?: number; offset?: number; status?: RunStatus }
    ): Promise<{ runs: ForgeFlowRun[]; total: number }> {
        const where = { orgId, ...(options?.status && { status: options.status }) };

        const [runs, total] = await Promise.all([
            prisma.forgeFlowRun.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: options?.limit || 20,
                skip: options?.offset || 0,
                include: { flow: { select: { name: true } } },
            }),
            prisma.forgeFlowRun.count({ where }),
        ]);

        return {
            runs: runs.map(this.toRun),
            total,
        };
    }

    /**
     * Execute a flow run (called by worker)
     * This processes nodes in topological order
     */
    static async executeRun(runId: string): Promise<ForgeFlowRun> {
        const runData = await prisma.forgeFlowRun.findUnique({
            where: { id: runId },
            include: {
                flow: true,
                nodes: true
            },
        });

        if (!runData) throw new Error('Run not found');
        if (runData.status !== 'queued') {
            throw new Error(`Run is not queued, current status: ${runData.status}`);
        }

        // Mark as running
        await prisma.forgeFlowRun.update({
            where: { id: runId },
            data: { status: 'running', startedAt: new Date() },
        });

        const definition = runData.flow.definitionJson as unknown as FlowDefinition;
        const executionOrder = this.getTopologicalOrder(definition);

        let totalSparks = 0;
        let hasError = false;
        const nodeOutputs: Record<string, unknown> = {};

        // Add input payload to node outputs for reference
        nodeOutputs['__input__'] = runData.inputPayload;

        for (const nodeId of executionOrder) {
            if (hasError) {
                // Skip remaining nodes if error occurred
                await prisma.forgeFlowRunNode.updateMany({
                    where: { flowRunId: runId, nodeId },
                    data: { status: 'skipped' },
                });
                continue;
            }

            const node = definition.nodes.find((n) => n.id === nodeId);
            if (!node) continue;

            try {
                // Mark node as running
                await prisma.forgeFlowRunNode.updateMany({
                    where: { flowRunId: runId, nodeId },
                    data: { status: 'running', startedAt: new Date() },
                });

                // Execute node
                const result = await this.executeNode(node, nodeOutputs, runData.orgId);

                // Store output for downstream nodes
                nodeOutputs[nodeId] = result.output;
                totalSparks += result.sparksUsed;

                // Update node status
                await prisma.forgeFlowRunNode.updateMany({
                    where: { flowRunId: runId, nodeId },
                    data: {
                        status: 'success',
                        output: result.output as object,
                        sparksUsed: result.sparksUsed,
                        finishedAt: new Date(),
                    },
                });

                // Log usage
                await prisma.forgeUsageLog.create({
                    data: {
                        orgId: runData.orgId,
                        flowRunId: runId,
                        nodeType: node.type,
                        provider: result.provider || 'internal',
                        sparksUsed: result.sparksUsed,
                        latencyMs: result.latencyMs,
                        assetUrl: result.assetUrl,
                    },
                });
            } catch (error) {
                hasError = true;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';

                await prisma.forgeFlowRunNode.updateMany({
                    where: { flowRunId: runId, nodeId },
                    data: {
                        status: 'failed',
                        errorMessage,
                        finishedAt: new Date(),
                    },
                });
            }
        }

        // Update run status
        const finalStatus: RunStatus = hasError ? 'failed' : 'success';
        const updatedRun = await prisma.forgeFlowRun.update({
            where: { id: runId },
            data: {
                status: finalStatus,
                totalSparksUsed: totalSparks,
                finishedAt: new Date(),
            },
        });

        return this.toRun(updatedRun);
    }

    /**
     * Execute a single node
     */
    private static async executeNode(
        node: FlowNode,
        previousOutputs: Record<string, unknown>,
        orgId: string
    ): Promise<{
        output: Record<string, unknown>;
        sparksUsed: number;
        provider?: string;
        latencyMs?: number;
        assetUrl?: string;
    }> {
        const startTime = Date.now();
        const baseCost = SPARKS_COST[node.type] || 0;

        switch (node.type) {
            case 'trigger':
                // Trigger nodes just pass through the input
                return {
                    output: { triggered: true, timestamp: new Date().toISOString() },
                    sparksUsed: 0,
                    provider: 'internal',
                    latencyMs: Date.now() - startTime,
                };

            case 'llm':
                // TODO: Integrate with Vertex AI
                return {
                    output: {
                        text: `[LLM Placeholder] Processed prompt: ${node.config.prompt}`,
                        model: 'gemini-pro',
                    },
                    sparksUsed: baseCost,
                    provider: 'vertexai',
                    latencyMs: Date.now() - startTime,
                };

            case 'image':
                // TODO: Integrate with Fal.ai Flux
                return {
                    output: {
                        imageUrl: 'https://placeholder.example/image.png',
                        prompt: node.config.prompt,
                        model: 'flux.1',
                    },
                    sparksUsed: baseCost,
                    provider: 'fal',
                    latencyMs: Date.now() - startTime,
                    assetUrl: 'https://placeholder.example/image.png',
                };

            case 'video':
                // TODO: Integrate with Runway/Kling
                const provider = node.config.mode === 'cinema' ? 'runway' : 'kling';
                return {
                    output: {
                        videoUrl: 'https://placeholder.example/video.mp4',
                        mode: node.config.mode || 'social',
                    },
                    sparksUsed: baseCost,
                    provider,
                    latencyMs: Date.now() - startTime,
                    assetUrl: 'https://placeholder.example/video.mp4',
                };

            case 'brandguard':
                // TODO: Integrate with BrandGuard middleware
                return {
                    output: {
                        compliant: true,
                        originalPrompt: node.config.prompt,
                        modifiedPrompt: node.config.prompt,
                    },
                    sparksUsed: baseCost,
                    provider: 'brandguard',
                    latencyMs: Date.now() - startTime,
                };

            case 'condition':
                // Evaluate condition
                const conditionResult = this.evaluateCondition(node.config, previousOutputs);
                return {
                    output: { result: conditionResult, branch: conditionResult ? 'true' : 'false' },
                    sparksUsed: 0,
                    provider: 'internal',
                    latencyMs: Date.now() - startTime,
                };

            case 'http':
                // TODO: Make HTTP request
                return {
                    output: {
                        statusCode: 200,
                        body: { success: true },
                        url: node.config.url,
                    },
                    sparksUsed: baseCost,
                    provider: 'http',
                    latencyMs: Date.now() - startTime,
                };

            case 'notification':
                // TODO: Send notification
                return {
                    output: {
                        sent: true,
                        channel: node.config.channel,
                        timestamp: new Date().toISOString(),
                    },
                    sparksUsed: baseCost,
                    provider: 'notification',
                    latencyMs: Date.now() - startTime,
                };

            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    /**
     * Evaluate a condition node
     */
    private static evaluateCondition(
        config: Record<string, unknown>,
        previousOutputs: Record<string, unknown>
    ): boolean {
        // Simple condition evaluation - can be extended
        const { field, operator, value } = config as {
            field?: string;
            operator?: string;
            value?: unknown;
        };

        if (!field) return true;

        // Get value from previous outputs using dot notation
        const actualValue = this.getNestedValue(previousOutputs, field);

        switch (operator) {
            case 'equals':
                return actualValue === value;
            case 'not_equals':
                return actualValue !== value;
            case 'contains':
                return String(actualValue).includes(String(value));
            case 'greater_than':
                return Number(actualValue) > Number(value);
            case 'less_than':
                return Number(actualValue) < Number(value);
            case 'exists':
                return actualValue !== undefined && actualValue !== null;
            default:
                return true;
        }
    }

    /**
     * Get nested value from object using dot notation
     */
    private static getNestedValue(obj: Record<string, unknown>, path: string): unknown {
        return path.split('.').reduce((current: unknown, key) => {
            if (current && typeof current === 'object') {
                return (current as Record<string, unknown>)[key];
            }
            return undefined;
        }, obj);
    }

    /**
     * Get topological order for node execution
     */
    private static getTopologicalOrder(definition: FlowDefinition): string[] {
        const inDegree = new Map<string, number>();
        const adjacency = new Map<string, string[]>();

        // Initialize
        for (const node of definition.nodes) {
            inDegree.set(node.id, 0);
            adjacency.set(node.id, []);
        }

        // Build graph
        for (const edge of definition.edges || []) {
            adjacency.get(edge.source)?.push(edge.target);
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        }

        // Kahn's algorithm
        const queue: string[] = [];
        const result: string[] = [];

        for (const [nodeId, degree] of inDegree) {
            if (degree === 0) queue.push(nodeId);
        }

        while (queue.length > 0) {
            const nodeId = queue.shift()!;
            result.push(nodeId);

            for (const neighbor of adjacency.get(nodeId) || []) {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }

    /**
     * Convert DB record to typed run
     */
    private static toRun(record: {
        id: string;
        flowId: string;
        orgId: string;
        triggeredBy: string | null;
        triggerType: string;
        inputPayload: unknown;
        status: string;
        totalSparksUsed: number;
        startedAt: Date | null;
        finishedAt: Date | null;
        createdAt: Date;
    }): ForgeFlowRun {
        return {
            id: record.id,
            flowId: record.flowId,
            orgId: record.orgId,
            triggeredBy: record.triggeredBy,
            triggerType: record.triggerType as TriggerType,
            inputPayload: record.inputPayload as Record<string, unknown>,
            status: record.status as RunStatus,
            totalSparksUsed: record.totalSparksUsed,
            startedAt: record.startedAt,
            finishedAt: record.finishedAt,
            createdAt: record.createdAt,
        };
    }

    /**
     * Convert DB record to typed run node
     */
    private static toRunNode(record: {
        id: string;
        flowRunId: string;
        nodeId: string;
        nodeType: string;
        input: unknown;
        output: unknown;
        status: string;
        sparksUsed: number;
        errorMessage: string | null;
        startedAt: Date | null;
        finishedAt: Date | null;
    }): ForgeFlowRunNode {
        return {
            id: record.id,
            flowRunId: record.flowRunId,
            nodeId: record.nodeId,
            nodeType: record.nodeType,
            input: record.input as Record<string, unknown> | null,
            output: record.output as Record<string, unknown> | null,
            status: record.status as NodeStatus,
            sparksUsed: record.sparksUsed,
            errorMessage: record.errorMessage,
            startedAt: record.startedAt,
            finishedAt: record.finishedAt,
        };
    }
}
