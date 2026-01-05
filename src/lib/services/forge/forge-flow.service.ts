/**
 * Forge Flow Service
 * Manages automation flow definitions and graph validation
 */

import { prisma } from '@/lib/prisma';

export type FlowStatus = 'draft' | 'published' | 'archived';

export type NodeType =
    | 'trigger'
    | 'llm'
    | 'image'
    | 'video'
    | 'brandguard'
    | 'condition'
    | 'http'
    | 'notification';

export interface FlowNode {
    id: string;
    type: NodeType;
    label: string;
    config: Record<string, unknown>;
    position: { x: number; y: number };
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

export interface FlowDefinition {
    nodes: FlowNode[];
    edges: FlowEdge[];
}

export interface ForgeFlow {
    id: string;
    orgId: string;
    name: string;
    description: string | null;
    definitionJson: FlowDefinition;
    status: FlowStatus;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateFlowInput {
    orgId: string;
    name: string;
    description?: string;
    definitionJson?: FlowDefinition;
}

export interface UpdateFlowInput {
    name?: string;
    description?: string;
    definitionJson?: FlowDefinition;
    status?: FlowStatus;
}

export interface FlowValidationError {
    type: 'error' | 'warning';
    nodeId?: string;
    message: string;
}

export class ForgeFlowService {
    /**
     * Create a new flow
     */
    static async create(input: CreateFlowInput): Promise<ForgeFlow> {
        const defaultDefinition: FlowDefinition = { nodes: [], edges: [] };

        const flow = await prisma.forgeFlow.create({
            data: {
                orgId: input.orgId,
                name: input.name,
                description: input.description || null,
                definitionJson: input.definitionJson || defaultDefinition,
            },
        });

        return this.toFlow(flow);
    }

    /**
     * Get flow by ID
     */
    static async getById(id: string): Promise<ForgeFlow | null> {
        const flow = await prisma.forgeFlow.findUnique({ where: { id } });
        return flow ? this.toFlow(flow) : null;
    }

    /**
     * Get flow by ID with org verification
     */
    static async getByIdAndOrg(id: string, orgId: string): Promise<ForgeFlow | null> {
        const flow = await prisma.forgeFlow.findFirst({
            where: { id, orgId },
        });
        return flow ? this.toFlow(flow) : null;
    }

    /**
     * List flows for an organization
     */
    static async listByOrg(
        orgId: string,
        options?: {
            status?: FlowStatus;
            limit?: number;
            offset?: number;
        }
    ): Promise<{ flows: ForgeFlow[]; total: number }> {
        const where = { orgId, ...(options?.status && { status: options.status }) };

        const [flows, total] = await Promise.all([
            prisma.forgeFlow.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                take: options?.limit || 50,
                skip: options?.offset || 0,
            }),
            prisma.forgeFlow.count({ where }),
        ]);

        return {
            flows: flows.map(this.toFlow),
            total,
        };
    }

    /**
     * Update a flow
     */
    static async update(id: string, orgId: string, input: UpdateFlowInput): Promise<ForgeFlow | null> {
        // Verify ownership
        const existing = await prisma.forgeFlow.findFirst({
            where: { id, orgId },
        });

        if (!existing) return null;

        // Validate if definition is being updated
        if (input.definitionJson) {
            const errors = this.validateFlowDefinition(input.definitionJson);
            const hasErrors = errors.some((e) => e.type === 'error');
            if (hasErrors) {
                throw new Error(`Invalid flow definition: ${errors.map((e) => e.message).join(', ')}`);
            }
        }

        const flow = await prisma.forgeFlow.update({
            where: { id },
            data: {
                ...(input.name && { name: input.name }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.definitionJson && { definitionJson: input.definitionJson }),
                ...(input.status && { status: input.status }),
            },
        });

        return this.toFlow(flow);
    }

    /**
     * Publish a flow (validates and changes status)
     */
    static async publish(id: string, orgId: string): Promise<ForgeFlow> {
        const flow = await this.getByIdAndOrg(id, orgId);
        if (!flow) throw new Error('Flow not found');

        // Validate before publishing
        const errors = this.validateFlowDefinition(flow.definitionJson);
        const hasErrors = errors.some((e) => e.type === 'error');
        if (hasErrors) {
            throw new Error(`Cannot publish: ${errors.filter((e) => e.type === 'error').map((e) => e.message).join(', ')}`);
        }

        const updated = await prisma.forgeFlow.update({
            where: { id },
            data: {
                status: 'published',
                version: { increment: 1 },
            },
        });

        return this.toFlow(updated);
    }

    /**
     * Archive a flow
     */
    static async archive(id: string, orgId: string): Promise<ForgeFlow | null> {
        const existing = await prisma.forgeFlow.findFirst({
            where: { id, orgId },
        });

        if (!existing) return null;

        const flow = await prisma.forgeFlow.update({
            where: { id },
            data: { status: 'archived' },
        });

        return this.toFlow(flow);
    }

    /**
     * Delete a flow (only drafts can be deleted)
     */
    static async delete(id: string, orgId: string): Promise<boolean> {
        const existing = await prisma.forgeFlow.findFirst({
            where: { id, orgId, status: 'draft' },
        });

        if (!existing) return false;

        await prisma.forgeFlow.delete({ where: { id } });
        return true;
    }

    /**
     * Validate flow definition for errors
     */
    static validateFlowDefinition(definition: FlowDefinition): FlowValidationError[] {
        const errors: FlowValidationError[] = [];

        // Check for at least one node
        if (!definition.nodes || definition.nodes.length === 0) {
            errors.push({ type: 'error', message: 'Flow must have at least one node' });
            return errors;
        }

        // Check for trigger node
        const triggerNodes = definition.nodes.filter((n) => n.type === 'trigger');
        if (triggerNodes.length === 0) {
            errors.push({ type: 'error', message: 'Flow must have at least one trigger node' });
        }
        if (triggerNodes.length > 1) {
            errors.push({ type: 'warning', message: 'Flow has multiple trigger nodes' });
        }

        // Validate node IDs are unique
        const nodeIds = new Set<string>();
        for (const node of definition.nodes) {
            if (nodeIds.has(node.id)) {
                errors.push({ type: 'error', nodeId: node.id, message: `Duplicate node ID: ${node.id}` });
            }
            nodeIds.add(node.id);
        }

        // Validate edges reference existing nodes
        for (const edge of definition.edges || []) {
            if (!nodeIds.has(edge.source)) {
                errors.push({ type: 'error', message: `Edge references non-existent source: ${edge.source}` });
            }
            if (!nodeIds.has(edge.target)) {
                errors.push({ type: 'error', message: `Edge references non-existent target: ${edge.target}` });
            }
        }

        // Check for cycles using DFS
        if (this.hasCycle(definition)) {
            errors.push({ type: 'error', message: 'Flow contains a cycle which would cause infinite execution' });
        }

        // Validate required configs per node type
        for (const node of definition.nodes) {
            const configErrors = this.validateNodeConfig(node);
            errors.push(...configErrors);
        }

        return errors;
    }

    /**
     * Check if the flow graph has cycles
     */
    private static hasCycle(definition: FlowDefinition): boolean {
        const adjacency = new Map<string, string[]>();
        for (const node of definition.nodes) {
            adjacency.set(node.id, []);
        }
        for (const edge of definition.edges || []) {
            adjacency.get(edge.source)?.push(edge.target);
        }

        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const dfs = (nodeId: string): boolean => {
            visited.add(nodeId);
            recursionStack.add(nodeId);

            for (const neighbor of adjacency.get(nodeId) || []) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (recursionStack.has(neighbor)) {
                    return true;
                }
            }

            recursionStack.delete(nodeId);
            return false;
        };

        for (const node of definition.nodes) {
            if (!visited.has(node.id)) {
                if (dfs(node.id)) return true;
            }
        }

        return false;
    }

    /**
     * Validate node-specific configuration
     */
    private static validateNodeConfig(node: FlowNode): FlowValidationError[] {
        const errors: FlowValidationError[] = [];

        switch (node.type) {
            case 'trigger':
                if (!node.config.triggerType) {
                    errors.push({
                        type: 'warning',
                        nodeId: node.id,
                        message: 'Trigger node should specify triggerType (webhook, scheduled, manual)',
                    });
                }
                break;

            case 'llm':
                if (!node.config.prompt) {
                    errors.push({
                        type: 'error',
                        nodeId: node.id,
                        message: 'LLM node requires a prompt',
                    });
                }
                break;

            case 'image':
                if (!node.config.prompt) {
                    errors.push({
                        type: 'error',
                        nodeId: node.id,
                        message: 'Image node requires a prompt',
                    });
                }
                break;

            case 'video':
                if (!node.config.mode) {
                    errors.push({
                        type: 'warning',
                        nodeId: node.id,
                        message: 'Video node should specify mode (cinema or social)',
                    });
                }
                break;

            case 'http':
                if (!node.config.url) {
                    errors.push({
                        type: 'error',
                        nodeId: node.id,
                        message: 'HTTP node requires a URL',
                    });
                }
                break;

            case 'notification':
                if (!node.config.channel) {
                    errors.push({
                        type: 'error',
                        nodeId: node.id,
                        message: 'Notification node requires a channel (email, slack, webhook)',
                    });
                }
                break;
        }

        return errors;
    }

    /**
     * Convert DB record to typed flow
     */
    private static toFlow(record: {
        id: string;
        orgId: string;
        name: string;
        description: string | null;
        definitionJson: unknown;
        status: string;
        version: number;
        createdAt: Date;
        updatedAt: Date;
    }): ForgeFlow {
        return {
            id: record.id,
            orgId: record.orgId,
            name: record.name,
            description: record.description,
            definitionJson: record.definitionJson as FlowDefinition,
            status: record.status as FlowStatus,
            version: record.version,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }
}
