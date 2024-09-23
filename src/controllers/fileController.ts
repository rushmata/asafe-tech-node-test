import { createWriteStream } from "fs";
import { uploadFileToS3 } from "../services/fileService.js";
import { validateFile } from "../utils/fileValidator.js";
import { join } from "path";
import prisma from "../prisma.js";

export const uploadProfilePictureToS3 = async (request, reply) => {
  try {
    const data = await request.file(); // Get file from request

    if (!data) {
      return reply.code(400).send({ error: "No file uploaded" });
    }

    // Validate file type and size
    validateFile(data);

    const userId = (request.user || {}).id || "anonymous"; // Get user ID (or fallback)
    const fileName = `${userId}-${Date.now()}-${data.filename}`;

    // Upload file to S3
    const fileUrl = await uploadFileToS3(data, fileName);

    // Update user's profile picture in the database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: `/uploads/${fileName}` }, // Store file path
    });
    return reply.send({
      success: true,
      fileUrl,
      message: "Profile picture uploaded successfully",
      user,
    });
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

export const uploadProfilePicture = async (request, reply) => {
  try {
    // Handle file upload
    const file = await request.file();

    validateFile(file);

    const userId = (request.user as any).id;
    const fileName = `${userId}-${Date.now()}-${file.filename}`;
    const uploadPath = join(__dirname, "../../uploads", fileName);

    // Save the file to the upload directory
    const fileStream = createWriteStream(uploadPath);
    await file.file.pipe(fileStream); // Pipe the file data to the file stream

    // Update user's profile picture in the database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: `/uploads/${fileName}` }, // Store file path
    });

    return reply.send({
      success: true,
      fileUrl: uploadPath,
      message: "Profile picture uploaded successfully",
      user,
    });
  } catch (err: any) {
    reply.code(500).send({ error: err.message });
  }

  // try {
  //   const data = await request.file();  // Get file from request

  //   if (!data) {
  //     return reply.code(400).send({ error: 'No file uploaded' });
  //   }

  //   // Validate file type and size
  //   validateFile(data);

  //   const userId = (request.user || {}).id || 'anonymous';  // Get user ID (or fallback)
  //   const fileName = `${userId}-${Date.now()}-${data.filename}`;

  //   // Upload file to S3
  //   const fileUrl = await uploadFileToS3(data, fileName);

  //   reply.send({ success: true, fileUrl });
  // } catch (err) {
  //   reply.code(500).send({ error: err.message });
  // }
};
