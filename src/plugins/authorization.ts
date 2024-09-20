import { FastifyReply, FastifyRequest } from "fastify";

// Authorization middleware
export const authorizeRoles = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify(); // Verify JWT token

      const user = request.user as { id: number; email: string; role: string };

      // Check if the user's role is in the list of allowed roles
      if (!roles.includes(user.role)) {
        return reply
          .status(403)
          .send({ message: "You do not have access to this resource" });
      }
    } catch (err) {
      reply.status(401).send({ message: "Authentication failed" });
    }
  };
};
