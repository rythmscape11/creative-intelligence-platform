import { BigQuery } from '@google-cloud/bigquery';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const keyFilename = process.env.GOOGLE_CLOUD_KEYFILE;

let bqClient: BigQuery | null = null;

export const getBigQueryClient = () => {
    if (!projectId) {
        console.warn('GOOGLE_CLOUD_PROJECT_ID is not set. BigQuery features disabled.');
        return null;
    }

    if (!bqClient) {
        bqClient = new BigQuery({
            projectId: projectId,
            keyFilename: keyFilename,
        });
    }
    return bqClient;
};
