import { NextRequest, NextResponse } from 'next/server';
import { getBigQueryClient } from '@/lib/gcp/bigquery';
import { generateSchemaAndMap } from '@/lib/ai/data-mapper';

export const maxDuration = 60; // AI processing might take time

export async function POST(req: NextRequest) {
    try {
        const rawData = await req.json();
        if (!Array.isArray(rawData) || rawData.length === 0) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // 1. AI Logic: Map Data and Generate Schema
        const { schema, mappedData } = await generateSchemaAndMap(rawData);

        // 2. BigQuery Logic
        const bq = getBigQueryClient();
        if (bq) {
            const datasetId = 'agency_analytics';
            const tableId = 'client_performance_streaming';

            // Ensure dataset exists
            const [dataset] = await bq.dataset(datasetId).get({ autoCreate: true });

            // Ensure table exists with AI-generated schema
            const [table] = await dataset.table(tableId).get({
                autoCreate: true,
                schema: schema
            });

            // Stream data insert
            await table.insert(mappedData);

            return NextResponse.json({ success: true, rowsInserted: mappedData.length, schema });
        }

        return NextResponse.json({ success: true, note: 'BigQuery disabled (Mock Mode)', mappedData });

    } catch (error: any) {
        console.error('Ingestion Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
