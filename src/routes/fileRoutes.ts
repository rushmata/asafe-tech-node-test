import {
  uploadProfilePicture,
  uploadProfilePictureToS3,
} from "../controllers/fileController.js";
import { FastifyInstance } from "fastify";

export const fileRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    "/upload-profile-picture-aws",
    {
      preValidation: [fastify.authenticate], // Optional: Authentication middleware
    },
    uploadProfilePictureToS3
  );
  // Upload profile picture (Authenticated route)
  fastify.post(
    "/upload-profile-picture",
    {
      preValidation: [fastify.authenticate], // Require authentication
    },
    uploadProfilePicture
  );
};
