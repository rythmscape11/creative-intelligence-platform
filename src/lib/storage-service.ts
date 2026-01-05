
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

export class StorageService {
    /**
     * Generate a presigned URL for uploading a file to S3
     * @param key The file path/key in S3 (e.g., "agency-1/project-2/image.png")
     * @param contentType The MIME type of the file
     * @param expiresInSeconds Expiration time in seconds (default: 300 / 5 mins)
     */
    static async getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds = 300) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        if (!bucketName) throw new Error('AWS_BUCKET_NAME is not configured');

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType,
            ACL: 'public-read', // Or 'private' depending on enhanced security needs
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
        return {
            uploadUrl: url,
            publicUrl: `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`,
            key,
        };
    }

    /**
     * Delete a file from S3
     */
    static async deleteFile(key: string) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        if (!bucketName) throw new Error('AWS_BUCKET_NAME is not configured');

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3Client.send(command);
    }
}
