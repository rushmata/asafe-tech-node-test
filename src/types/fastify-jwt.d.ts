import '@fastify/jwt';

// Extend Fastify's Request interface to include the `jwt` object.
declare module 'fastify' {
  interface FastifyInstance {
    JWT: {
      sign: (payload: any, options?: any) => string;
      verify: (token: string) => any;
    };
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
