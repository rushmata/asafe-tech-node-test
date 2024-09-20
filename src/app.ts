import {FastifyInstance} from 'fastify';

export const appRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
};
