import Fastify, { FastifyInstance } from 'fastify';
import { appRoutes } from './routes/index';
import { setupCors } from './plugins/cors';
import { setupSensible } from './plugins/sensible';
import prisma from './prisma';

const server: FastifyInstance = Fastify({ logger: true });

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
