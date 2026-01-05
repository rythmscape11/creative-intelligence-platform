import { getGenerativeModel } from '@/lib/gcp/vertex';

export const generateSchemaAndMap = async (rawData: any[]) => {
    const model = getGenerativeModel();
    if (!model) throw new Error('AI Model not configured');

    // Take a sample of data to infer schema
    const sample = rawData.slice(0, 5);

    const prompt = `
    Analyze this raw marketing data sample:
    ${JSON.stringify(sample)}

    1. Create a Google BigQuery compatible JSON schema.
    2. Normalize the data keys to snake_case.
    3. Return a JSON object with two keys: "schema" (array of fields with name/type) and "mappedData" (array of normalized objects).
    
    Output ONLY valid JSON.
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0].content.parts[0].text;
    const jsonStr = text?.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(jsonStr || '{}');
    } catch (e) {
        console.error('AI Mapping Failed:', e);
        throw new Error('Failed to map data');
    }
};
