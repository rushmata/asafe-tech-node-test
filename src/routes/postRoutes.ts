import { FastifyInstance } from "fastify";
import { config } from "dotenv";
import { createPost, getAllPosts } from "../controllers/postController";

config();

export const postRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/create-post', createPost);
    fastify.get('/posts', getAllPosts);
};
