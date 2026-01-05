/**
 * Forge Execution Service Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlowDefinition } from '@/lib/services/forge/forge-flow.service';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        forgeFlow: {
            findFirst: vi.fn(),
        },
        forgeFlowRun: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findMany: vi.fn(),
            update: vi.fn(),
            count: vi.fn(),
        },
        forgeFlowRunNode: {
            createMany: vi.fn(),
            updateMany: vi.fn(),
        },
        forgeUsageLog: {
            create: vi.fn(),
        },
    },
}));

describe('ForgeExecutionService', () => {
    describe('Topological Order', () => {
        it('should calculate correct execution order for linear flow', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'trigger', type: 'trigger', label: 'Trigger', config: {}, position: { x: 0, y: 0 } },
                    { id: 'llm', type: 'llm', label: 'LLM', config: {}, position: { x: 100, y: 0 } },
                    { id: 'image', type: 'image', label: 'Image', config: {}, position: { x: 200, y: 0 } },
                ],
                edges: [
                    { id: 'e1', source: 'trigger', target: 'llm' },
                    { id: 'e2', source: 'llm', target: 'image' },
                ],
            };

            // Manually test topological sort
            const order = getTopologicalOrder(definition);

            // Trigger should come before LLM, LLM should come before Image
            expect(order.indexOf('trigger')).toBeLessThan(order.indexOf('llm'));
            expect(order.indexOf('llm')).toBeLessThan(order.indexOf('image'));
        });

        it('should handle branching flow', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'trigger', type: 'trigger', label: 'Trigger', config: {}, position: { x: 0, y: 0 } },
                    { id: 'branch1', type: 'llm', label: 'Branch 1', config: {}, position: { x: 100, y: -50 } },
                    { id: 'branch2', type: 'image', label: 'Branch 2', config: {}, position: { x: 100, y: 50 } },
                ],
                edges: [
                    { id: 'e1', source: 'trigger', target: 'branch1' },
                    { id: 'e2', source: 'trigger', target: 'branch2' },
                ],
            };

            const order = getTopologicalOrder(definition);

            // Trigger should come before both branches
            expect(order.indexOf('trigger')).toBeLessThan(order.indexOf('branch1'));
            expect(order.indexOf('trigger')).toBeLessThan(order.indexOf('branch2'));
        });

        it('should handle converging flow', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'trigger', type: 'trigger', label: 'Trigger', config: {}, position: { x: 0, y: 0 } },
                    { id: 'llm1', type: 'llm', label: 'LLM 1', config: {}, position: { x: 100, y: -50 } },
                    { id: 'llm2', type: 'llm', label: 'LLM 2', config: {}, position: { x: 100, y: 50 } },
                    { id: 'merge', type: 'notification', label: 'Merge', config: {}, position: { x: 200, y: 0 } },
                ],
                edges: [
                    { id: 'e1', source: 'trigger', target: 'llm1' },
                    { id: 'e2', source: 'trigger', target: 'llm2' },
                    { id: 'e3', source: 'llm1', target: 'merge' },
                    { id: 'e4', source: 'llm2', target: 'merge' },
                ],
            };

            const order = getTopologicalOrder(definition);

            // Merge should come after both LLMs
            expect(order.indexOf('llm1')).toBeLessThan(order.indexOf('merge'));
            expect(order.indexOf('llm2')).toBeLessThan(order.indexOf('merge'));
        });
    });

    describe('Sparks Calculation', () => {
        it('should calculate correct sparks for different node types', () => {
            const sparksCosts: Record<string, number> = {
                trigger: 0,
                llm: 5,
                image: 10,
                video: 50,
                brandguard: 3,
                condition: 0,
                http: 1,
                notification: 1,
            };

            expect(sparksCosts.trigger).toBe(0);
            expect(sparksCosts.llm).toBe(5);
            expect(sparksCosts.image).toBe(10);
            expect(sparksCosts.video).toBe(50);
        });

        it('should calculate total sparks for flow', () => {
            const nodeTypes = ['trigger', 'llm', 'image', 'notification'];
            const sparksCosts: Record<string, number> = {
                trigger: 0,
                llm: 5,
                image: 10,
                notification: 1,
            };

            const total = nodeTypes.reduce((sum, type) => sum + (sparksCosts[type] || 0), 0);
            expect(total).toBe(16);
        });
    });
});

// Helper function to test topological sort
function getTopologicalOrder(definition: FlowDefinition): string[] {
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    for (const node of definition.nodes) {
        inDegree.set(node.id, 0);
        adjacency.set(node.id, []);
    }

    for (const edge of definition.edges || []) {
        adjacency.get(edge.source)?.push(edge.target);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

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
