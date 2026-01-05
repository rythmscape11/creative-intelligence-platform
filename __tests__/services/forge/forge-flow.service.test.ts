/**
 * Forge Flow Service Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForgeFlowService, FlowDefinition } from '@/lib/services/forge/forge-flow.service';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
    prisma: {
        forgeFlow: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            findMany: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
    },
}));

describe('ForgeFlowService', () => {
    describe('validateFlowDefinition', () => {
        it('should return error for empty flow', () => {
            const definition: FlowDefinition = { nodes: [], edges: [] };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            expect(errors).toHaveLength(1);
            expect(errors[0].type).toBe('error');
            expect(errors[0].message).toContain('at least one node');
        });

        it('should return error for flow without trigger', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'node1', type: 'llm', label: 'LLM', config: { prompt: 'test' }, position: { x: 0, y: 0 } },
                ],
                edges: [],
            };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            expect(errors.some(e => e.message.includes('trigger node'))).toBe(true);
        });

        it('should return warning for multiple triggers', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'trigger1', type: 'trigger', label: 'Trigger 1', config: {}, position: { x: 0, y: 0 } },
                    { id: 'trigger2', type: 'trigger', label: 'Trigger 2', config: {}, position: { x: 100, y: 0 } },
                ],
                edges: [],
            };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            expect(errors.some(e => e.type === 'warning' && e.message.includes('multiple trigger'))).toBe(true);
        });

        it('should detect duplicate node IDs', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'same_id', type: 'trigger', label: 'Trigger', config: {}, position: { x: 0, y: 0 } },
                    { id: 'same_id', type: 'llm', label: 'LLM', config: { prompt: 'test' }, position: { x: 100, y: 0 } },
                ],
                edges: [],
            };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            expect(errors.some(e => e.message.includes('Duplicate node ID'))).toBe(true);
        });

        it('should detect cycles in flow', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'node1', type: 'trigger', label: 'Trigger', config: {}, position: { x: 0, y: 0 } },
                    { id: 'node2', type: 'llm', label: 'LLM', config: { prompt: 'test' }, position: { x: 100, y: 0 } },
                    { id: 'node3', type: 'image', label: 'Image', config: { prompt: 'test' }, position: { x: 200, y: 0 } },
                ],
                edges: [
                    { id: 'edge1', source: 'node1', target: 'node2' },
                    { id: 'edge2', source: 'node2', target: 'node3' },
                    { id: 'edge3', source: 'node3', target: 'node2' }, // Creates cycle
                ],
            };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            expect(errors.some(e => e.message.includes('cycle'))).toBe(true);
        });

        it('should validate LLM node requires prompt', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'trigger', type: 'trigger', label: 'Trigger', config: { triggerType: 'manual' }, position: { x: 0, y: 0 } },
                    { id: 'llm', type: 'llm', label: 'LLM', config: {}, position: { x: 100, y: 0 } },
                ],
                edges: [{ id: 'edge1', source: 'trigger', target: 'llm' }],
            };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            expect(errors.some(e => e.nodeId === 'llm' && e.message.includes('prompt'))).toBe(true);
        });

        it('should validate HTTP node requires URL', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'trigger', type: 'trigger', label: 'Trigger', config: { triggerType: 'manual' }, position: { x: 0, y: 0 } },
                    { id: 'http', type: 'http', label: 'HTTP', config: {}, position: { x: 100, y: 0 } },
                ],
                edges: [{ id: 'edge1', source: 'trigger', target: 'http' }],
            };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            expect(errors.some(e => e.nodeId === 'http' && e.message.includes('URL'))).toBe(true);
        });

        it('should pass validation for valid flow', () => {
            const definition: FlowDefinition = {
                nodes: [
                    { id: 'trigger', type: 'trigger', label: 'Trigger', config: { triggerType: 'manual' }, position: { x: 0, y: 0 } },
                    { id: 'llm', type: 'llm', label: 'LLM', config: { prompt: 'Generate content' }, position: { x: 100, y: 0 } },
                    { id: 'image', type: 'image', label: 'Image', config: { prompt: 'Create image' }, position: { x: 200, y: 0 } },
                ],
                edges: [
                    { id: 'edge1', source: 'trigger', target: 'llm' },
                    { id: 'edge2', source: 'llm', target: 'image' },
                ],
            };
            const errors = ForgeFlowService.validateFlowDefinition(definition);

            const hasErrors = errors.some(e => e.type === 'error');
            expect(hasErrors).toBe(false);
        });
    });
});
