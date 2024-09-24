import { uploadProfilePictureToS3 } from '../../controllers/fileController';
import { uploadFileToS3 } from '../../services/fileService';
import { validateFile } from '../../utils/fileValidator';

jest.mock('../../services/fileService');
jest.mock('../../utils/fileValidator');

interface MockRequest {
  file: jest.Mock;
  user: { id: Number };
}

interface MockReply {
  code: jest.Mock;
  send: jest.Mock;
}

describe('File Controller', () => {
  const mockRequest: MockRequest = {
    file: jest.fn(),
    user: { id: 2 },
  };

  const mockReply: MockReply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  it('should upload a profile picture successfully', async () => {
    mockRequest.file.mockResolvedValue({
      filename: 'profile.jpg',
      file: Buffer.from('mock file data'),
      mimetype: 'image/jpeg',
    });
    (uploadFileToS3 as jest.Mock).mockResolvedValue('https://s3.amazonaws.com/asafe-node-tech-test/user-12345.jpg');

    await uploadProfilePictureToS3(mockRequest, mockReply);

    expect(validateFile).toHaveBeenCalled();
    expect(uploadFileToS3).toHaveBeenCalledWith(expect.any(Object), expect.any(String));
    expect(mockReply.send).toHaveBeenCalledWith({
      success: true,
      fileUrl: 'https://s3.amazonaws.com/asafe-node-tech-test/user-12345.jpg',
      message: "Profile picture uploaded successfully",
      user: {
      email: "admin@example.com",
      id: 2,
      name: "Admin User",
      password: "$2b$10$Z4t4JhdjHQ3/I.U3baOfl.F4zB6dRYE5CmojWnykntHacO.rzA.ym",
      profilePicture: "/uploads/2-1727201626556-profile.jpg",
      role: "admin"
      },
    });
  });

  it('should return 400 if no file is uploaded', async () => {
    mockRequest.file.mockResolvedValue(undefined); // Simulate no file uploaded

    await uploadProfilePictureToS3(mockRequest, mockReply);

    expect(mockReply.code).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'No file uploaded' });
  });

  it('should handle file upload errors', async () => {
    mockRequest.file.mockResolvedValue({
      filename: 'profile.jpg',
      file: Buffer.from('mock file data'),
      mimetype: 'image/jpeg'
    });
    (uploadFileToS3 as jest.Mock).mockRejectedValue(new Error('S3 error'));

    await uploadProfilePictureToS3(mockRequest, mockReply);

    expect(mockReply.code).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'S3 error'
    });
  });
});
