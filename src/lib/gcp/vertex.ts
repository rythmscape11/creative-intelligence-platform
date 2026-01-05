import { VertexAI } from '@google-cloud/vertexai';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

let vertexClient: VertexAI | null = null;

export const getVertexClient = () => {
    if (!projectId) {
        console.warn('GOOGLE_CLOUD_PROJECT_ID is not set. Vertex AI features will be disabled.');
        return null;
    }

    if (!vertexClient) {
        vertexClient = new VertexAI({
            project: projectId,
            location: location,
        });
    }
    return vertexClient;
};

export const getGenerativeModel = (modelName: string = 'gemini-1.5-pro-preview-0409') => {
    const client = getVertexClient();
    if (!client) return null;

    return client.getGenerativeModel({
        model: modelName,
        generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
        },
    });
};
