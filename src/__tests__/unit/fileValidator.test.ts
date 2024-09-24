import { validateFile } from "../../utils/fileValidator";

describe('File Validator', () => {
  it('should validate a correct file', () => {
    const validFile = {
      mimetype: 'image/jpeg',
      file: { truncated: false },
    };

    // This is correct: passing the function reference to expect
    expect(() => validateFile(validFile)).not.toThrow();
  });

  it('should throw an error for an invalid file type', () => {
    const invalidFile = {
      mimetype: 'application/pdf',
      file: { truncated: false },
    };

    // This checks if it throws the specified error message
    expect(() => validateFile(invalidFile)).toThrow('Invalid file type. Only JPEG and PNG files are allowed.');
  });

  it('should throw an error for a large file', () => {
    const largeFile = {
      mimetype: 'image/jpeg',
      file: { truncated: true }, // Simulates a file that is too large
    };

    expect(() => validateFile(largeFile)).toThrow('File is too large.');
  });

  it('should throw an error if no file is uploaded', () => {
    const noFile = undefined; // Simulating no file uploaded

    expect(() => validateFile(noFile)).toThrow('No file uploaded');
  });
});