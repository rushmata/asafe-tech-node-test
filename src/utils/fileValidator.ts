
export const validateFile = (file: { mimetype: string; file: { truncated: boolean }} | undefined): boolean => {
  if (!file || Object.keys(file).length === 0) {
    throw new Error("No file uploaded");
  }

  const allowedMimeTypes = ["image/jpeg", "image/png"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Invalid file type. Only JPEG and PNG files are allowed.");
  }

  if (file.file.truncated) {
    throw new Error("File is too large.");
  }

  return true;
};
