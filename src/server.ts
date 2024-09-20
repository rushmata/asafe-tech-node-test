import Fastify, { FastifyInstance } from 'fastify';
import { appRoutes } from './routes/index';
import { setupCors } from './plugins/cors';
import { setupSensible } from './plugins/sensible';
import prisma from './prisma';

const server: FastifyInstance = Fastify({ logger: true });

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

// Register routes
server.register(appRoutes);
// Close Prisma connection when the server stops
server.addHook('onClose', async () => {
  await prisma.$disconnect();
});
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server listening at ${address}`);
});
