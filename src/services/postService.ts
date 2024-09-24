import prisma from '../prisma';

// Define types for the post creation input and output
interface CreatePostInput {
  title: string;
  content: string;
  authorId: number;
}

export async function createPostService(data: CreatePostInput) {
  const { title, content, authorId } = data;

  // Create a new post
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId
    },
  });

  return post;
}
export async function getAllPostsService() {
  const posts = await prisma.post.findMany();
  return posts;
}
