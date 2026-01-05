/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3');
vi.mock('@aws-sdk/s3-request-presigner');

import { S3Service } from '@/lib/services/s3-service';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

describe('S3Service', () => {
  let s3Service: S3Service;
  let mockSend: any;
  let mockGetSignedUrl: any;

  beforeEach(() => {
    // Reset environment variables
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_S3_BUCKET = 'test-bucket';
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';

    vi.clearAllMocks();

    // Setup mocks
    mockSend = vi.fn();
    mockGetSignedUrl = getSignedUrl as any;
    vi.mocked(mockGetSignedUrl).mockResolvedValue('https://signed-url.com');

    vi.mocked(S3Client).mockImplementation(() => ({
      send: mockSend,
    } as any));

    s3Service = new S3Service();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockResponse = {
        ETag: '"test-etag"',
      };
      mockSend.mockResolvedValue(mockResponse);

      const result = await s3Service.uploadFile(
        'test/file.txt',
        Buffer.from('test content'),
        {
          contentType: 'text/plain',
          metadata: { userId: 'test-user' },
        }
      );

      expect(result).toEqual({
        key: 'test/file.txt',
        location: 'https://test-bucket.s3.us-east-1.amazonaws.com/test/file.txt',
        etag: '"test-etag"',
        bucket: 'test-bucket',
      });

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should handle upload errors', async () => {
      mockSend.mockRejectedValue(new Error('Upload failed'));

      await expect(
        s3Service.uploadFile('test/file.txt', Buffer.from('test content'))
      ).rejects.toThrow('S3 upload failed: Upload failed');
    });

    it('should use default options when none provided', async () => {
      const mockResponse = { ETag: '"test-etag"' };
      mockSend.mockResolvedValue(mockResponse);

      const result = await s3Service.uploadFile('test/file.txt', Buffer.from('test content'));

      expect(result).toEqual({
        key: 'test/file.txt',
        location: 'https://test-bucket.s3.us-east-1.amazonaws.com/test/file.txt',
        etag: '"test-etag"',
        bucket: 'test-bucket',
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSignedDownloadUrl', () => {
    it('should generate signed download URL', async () => {
      const mockSignedUrl = 'https://signed-url.example.com';
      mockGetSignedUrl.mockResolvedValue(mockSignedUrl);

      const result = await s3Service.getSignedDownloadUrl('test/file.txt', {
        expiresIn: 3600,
      });

      expect(result).toBe(mockSignedUrl);
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    });

    it('should handle signed URL generation errors', async () => {
      mockGetSignedUrl.mockRejectedValue(new Error('Signing failed'));

      await expect(
        s3Service.getSignedDownloadUrl('test/file.txt')
      ).rejects.toThrow('Failed to generate signed URL: Signing failed');
    });
  });

  describe('getSignedUploadUrl', () => {
    it('should generate signed upload URL', async () => {
      const mockSignedUrl = 'https://signed-upload-url.example.com';
      mockGetSignedUrl.mockResolvedValue(mockSignedUrl);

      const result = await s3Service.getSignedUploadUrl(
        'test/file.txt',
        'text/plain',
        { expiresIn: 1800 }
      );

      expect(result).toBe(mockSignedUrl);
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      mockSend.mockResolvedValue({});

      await s3Service.deleteFile('test/file.txt');

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should handle delete errors', async () => {
      mockSend.mockRejectedValue(new Error('Delete failed'));

      await expect(
        s3Service.deleteFile('test/file.txt')
      ).rejects.toThrow('S3 delete failed: Delete failed');
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      mockSend.mockResolvedValue({});

      const result = await s3Service.fileExists('test/file.txt');

      expect(result).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      const error = new Error('Not Found');
      error.name = 'NotFound';
      mockSend.mockRejectedValue(error);

      const result = await s3Service.fileExists('test/file.txt');

      expect(result).toBe(false);
    });

    it('should return false for 404 status code', async () => {
      const error = new Error('Not Found');
      (error as any).$metadata = { httpStatusCode: 404 };
      mockSend.mockRejectedValue(error);

      const result = await s3Service.fileExists('test/file.txt');

      expect(result).toBe(false);
    });

    it('should throw error for other errors', async () => {
      mockSend.mockRejectedValue(new Error('Access denied'));

      await expect(
        s3Service.fileExists('test/file.txt')
      ).rejects.toThrow('S3 head object failed: Access denied');
    });
  });

  describe('getFileInfo', () => {
    it('should return file information', async () => {
      const mockResponse = {
        ContentLength: 1024,
        LastModified: new Date('2023-01-01'),
        ETag: '"test-etag"',
        ContentType: 'text/plain',
        Metadata: { userId: 'test-user' },
      };
      mockSend.mockResolvedValue(mockResponse);

      const result = await s3Service.getFileInfo('test/file.txt');

      expect(result).toEqual({
        key: 'test/file.txt',
        size: 1024,
        lastModified: new Date('2023-01-01'),
        etag: '"test-etag"',
        contentType: 'text/plain',
        metadata: { userId: 'test-user' },
      });
    });
  });

  describe('listFiles', () => {
    it('should list files with prefix', async () => {
      const mockResponse = {
        Contents: [
          {
            Key: 'test/file1.txt',
            Size: 1024,
            LastModified: new Date('2023-01-01'),
            ETag: '"etag1"',
          },
          {
            Key: 'test/file2.txt',
            Size: 2048,
            LastModified: new Date('2023-01-02'),
            ETag: '"etag2"',
          },
        ],
      };
      mockSend.mockResolvedValue(mockResponse);

      const result = await s3Service.listFiles('test/', 100);

      expect(result).toEqual([
        {
          key: 'test/file1.txt',
          size: 1024,
          lastModified: new Date('2023-01-01'),
          etag: '"etag1"',
        },
        {
          key: 'test/file2.txt',
          size: 2048,
          lastModified: new Date('2023-01-02'),
          etag: '"etag2"',
        },
      ]);
    });

    it('should handle empty list', async () => {
      mockSend.mockResolvedValue({ Contents: [] });

      const result = await s3Service.listFiles('empty/');

      expect(result).toEqual([]);
    });
  });

  describe('getUserStorageUsage', () => {
    it('should calculate user storage usage', async () => {
      const mockResponse = {
        Contents: [
          { Key: 'users/test-user/file1.txt', Size: 1024 },
          { Key: 'users/test-user/file2.txt', Size: 2048 },
        ],
      };
      mockSend.mockResolvedValue(mockResponse);

      const result = await s3Service.getUserStorageUsage('test-user');

      expect(result).toEqual({
        totalSize: 3072,
        fileCount: 2,
      });
    });
  });

  describe('cleanupTempFiles', () => {
    it('should cleanup old temporary files', async () => {
      const oldDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      const recentDate = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago

      const mockListResponse = {
        Contents: [
          { Key: 'temp/old-file.txt', LastModified: oldDate },
          { Key: 'temp/recent-file.txt', LastModified: recentDate },
        ],
      };

      mockSend
        .mockResolvedValueOnce(mockListResponse) // listFiles call
        .mockResolvedValue({}); // deleteFile calls

      const result = await s3Service.cleanupTempFiles(24);

      expect(result).toBe(1); // Only one old file should be deleted
      expect(mockSend).toHaveBeenCalledTimes(2); // 1 list + 1 delete
    });
  });

  describe('static key generation methods', () => {
    it('should generate user file key', () => {
      const key = S3Service.generateUserFileKey('user123', 'avatar', 'profile.jpg');
      
      expect(key).toMatch(/^users\/user123\/avatar\/\d+_profile\.jpg$/);
    });

    it('should generate export key', () => {
      const key = S3Service.generateExportKey('user123', 'strategy456', 'pptx', 'strategy.pptx');
      
      expect(key).toMatch(/^exports\/user123\/strategy456\/\d+_strategy\.pptx$/);
    });

    it('should generate temp key', () => {
      const key = S3Service.generateTempKey('upload', 'temp.txt');
      
      expect(key).toMatch(/^temp\/upload\/\d+_[a-z0-9]+_temp\.txt$/);
    });

    it('should sanitize filenames in keys', () => {
      const key = S3Service.generateUserFileKey('user123', 'document', 'my file (1).pdf');
      
      expect(key).toMatch(/^users\/user123\/document\/\d+_my_file__1_\.pdf$/);
    });
  });
});
