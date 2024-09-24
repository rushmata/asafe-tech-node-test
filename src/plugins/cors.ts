import fastifyCors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

export const setupCors = (server: FastifyInstance) => {
  server.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  });
};
