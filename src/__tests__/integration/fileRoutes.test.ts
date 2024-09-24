import { server } from '../../server';
import { uploadFileToS3 } from '../../services/fileService'; // Mocked service
import { FastifyInstance } from 'fastify'; // Type for Fastify instance
// import { MultipartFile } from 'fastify-multipart'; // Type for multipart file (optional if used in your app)

jest.mock('../../services/fileService'); // Mock AWS S3 service to avoid real network calls

describe('File Routes', () => {
  let app: FastifyInstance;

  // Set up Fastify instance before all tests
  beforeAll(async () => {
    app = server;
    await app.ready(); // Ensures the app and its plugins are fully loaded
  });

  // Close Fastify instance after all tests
  afterAll(() => {
    app.close();
  });

  it('should upload a file successfully via the route', async () => {
    // Mock the S3 service response
    (uploadFileToS3 as jest.Mock).mockResolvedValue('https://s3.amazonaws.com/asafe-node-tech-test/user-12345.jpg');

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNjg1MDcyM30.neGNh-1TIWTNszjdouq69ynqc3gt2tA2ki_Q7OhFucY';

    // Inject a POST request to the Fastify app
    const response = await app.inject({
      method: 'POST',
      url: '/upload-profile-picture',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${mockToken}`
      },
      payload: {
        file: {
          data: Buffer.from('fake file data'),
          filename: 'profile.jpg',
          mimetype: 'image/jpeg',
        },
      } as Record<string, unknown>, // TypeScript requires casting payload as a generic record
    });

    expect(response.statusCode).toBe(200); // Ensure the response status code is 200 (success)
    expect(response.json()).toEqual({
      success: true,
      fileUrl: 'https://s3.amazonaws.com/asafe-node-tech-test/user-12345.jpg',
    });
  });
});
