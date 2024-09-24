import Fastify, { FastifyInstance } from 'fastify';
import { userRoutes } from './routes/userRoutes';
import { fileRoutes } from './routes/fileRoutes';
import { setupCors } from './plugins/cors';
import { setupSensible } from './plugins/sensible';
import prisma from './prisma';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { postRoutes } from './routes/postRoutes';

export const server: FastifyInstance = Fastify({ logger: true });

// Register JWT Plugin
server.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'There is no JWT secret defined',
});
// JWT Authentication Hook
server.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Register plugins
setupCors(server);
setupSensible(server);
server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // Set max file size to 10MB
  },
});

// Register routes
server.register(userRoutes);
server.register(fileRoutes);
server.register(postRoutes);

// Close Prisma connection when the server stops
server.addHook('onClose', async () => {
  await prisma.$disconnect();
});
// Serve static files from the "uploads" directory
server.register(fastifyStatic, {
  root: join(__dirname, 'uploads'),
  prefix: '/uploads/', // Static file prefix
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
