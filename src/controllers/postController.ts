import { FastifyReply, FastifyRequest } from "fastify";
import { createPostService, getAllPostsService } from "../services/postService";

// Define the interface for request body
interface CreatePostBody {
  body: {
    title: string;
    content: string;
    authorId: number;
  };
}

// Create a post and return the result
export const createPost = async (
  request: FastifyRequest<{ Body: CreatePostBody }>,
  reply: FastifyReply
) => {
  try {
    const { title, content, authorId }: any = request.body;
    const post = await createPostService({ title, content, authorId });
    
    return reply.code(201).send(post);
  } catch (err: any) {
    return reply
      .code(500)
      .send({ error: `An error occurred while creating the post: ${JSON.parse(JSON.stringify(err.message))}` });
  }
};

export const getAllPosts = async (
  request: FastifyRequest<{ Body: CreatePostBody }>,
  reply: FastifyReply
) => {
  const posts = await getAllPostsService();
  return reply.code(201).send(posts);
}
