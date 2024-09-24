import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import { s3 } from '../config/aws.js';

export const uploadFileToS3 = async (file, fileName) => {
  const params: PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: fileName,           // File name in S3
    Body: file.file,         // File stream from Fastify
    ContentType: file.mimetype,
    ACL: 'private',          // Change this if you want public files
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;     // URL of the uploaded file in S3
  } catch (err: any) {
    throw new Error(`File upload failed: ${err.message}`);
  }
};
