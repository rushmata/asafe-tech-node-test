import { FastifyInstance } from 'fastify';

export const setupCors = (server: FastifyInstance) => {
  server.register(require('@fastify/cors'), {
    origin: '*',
  });
};
