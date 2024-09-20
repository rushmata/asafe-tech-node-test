import { FastifyInstance } from 'fastify';
import prisma from '../prisma';

export const appRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  // Create User
  fastify.post('/users', async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string };
    const user = await prisma.user.create({
      data: { name, email },
    });
    return reply.status(201).send(user);
  });
  // Get All Users
  fastify.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany();
    return reply.send(users);
  });

  // Get a User by ID
  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    return reply.send(user);
  });

  // Update User
  fastify.put('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    const { name, email } = request.body as { name: string; email: string };
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    return reply.send(user);
  });

  // Delete User
  fastify.delete('/users/:id', async (request, reply) => {
    const { id } = request.params as { id: number };
    await prisma.user.delete({
      where: { id },
    });
    return reply.status(204).send();
  });
};
