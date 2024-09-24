import { uploadFileToS3 } from '../../services/fileService';
import { s3 } from '../../config/aws';

jest.mock('../../src/config/aws', () => ({
  s3: {
    upload: jest.fn().mockReturnThis(), // Mock the upload function
    promise: jest.fn(),
  },
}));

describe('File Service', () => {
  const mockFile = {
    file: Buffer.from('mock file data'),
    mimetype: 'image/jpeg',
  };
  const mockFileName = 'user-12345.jpg';

  it('should upload a file to S3 successfully', async () => {
    // Directly set the mocked promise return
    (s3.upload as jest.Mock).mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Location: 'https://s3.amazonaws.com/asafe-node-tech-test/user-12345.jpg',
      }),
    });

    const result = await uploadFileToS3(mockFile, mockFileName);

    expect(s3.upload).toHaveBeenCalledWith({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: mockFileName,
      Body: mockFile.file,
      ContentType: mockFile.mimetype,
      ACL: 'private',
    });
    expect(result).toBe('https://s3.amazonaws.com/your-bucket/user-12345.jpg');
  });

  it('should throw an error if S3 upload fails', async () => {
    (s3.upload as jest.Mock).mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('S3 upload error')),
    });

    await expect(uploadFileToS3(mockFile, mockFileName)).rejects.toThrow('File upload failed: S3 upload error');
  });
});
