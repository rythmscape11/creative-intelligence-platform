import { Storage } from '@google-cloud/storage';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const keyFilename = process.env.GOOGLE_CLOUD_KEYFILE; // Optional: Path to service account key

let storageClient: Storage | null = null;

export const getStorageClient = () => {
    if (!projectId && !keyFilename) {
        // GCS can sometimes infer auth from environment, but warning needed
        console.warn('GOOGLE_CLOUD_PROJECT_ID or GOOGLE_APPLICATION_CREDENTIALS not fully configured.');
    }

    if (!storageClient) {
        storageClient = new Storage({
            projectId: projectId,
            keyFilename: keyFilename, // If undefined, SDK looks for GOOGLE_APPLICATION_CREDENTIALS
        });
    }
    return storageClient;
};

export const getBucket = (bucketName: string) => {
    const storage = getStorageClient();
    if (!storage) return null;
    return storage.bucket(bucketName);
};
