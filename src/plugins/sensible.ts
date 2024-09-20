import { FastifyInstance } from 'fastify';

export const setupSensible = (server: FastifyInstance) => {
  server.register(require('@fastify/sensible'));
};
