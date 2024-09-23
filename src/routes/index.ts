import { FastifyInstance } from "fastify";
import prisma from "../prisma";
import { compare, hash } from "bcrypt";
import { authorizeRoles } from "../plugins/authorization";
import { createWriteStream } from "fs";
import { join } from "path";

export const appRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
  // Upload profile picture (Authenticated route)
  fastify.post(
    "/upload-profile-picture",
    {
      preValidation: [fastify.authenticate], // Require authentication
    },
    async (request, reply) => {
      // Handle file upload
      const file = await request.file();

      if (!file || Object.keys(file).length === 0) {
        return reply.status(400).send({ message: "No file uploaded" });
      }

      const userId = (request.user as any).id;
      const fileName = `${userId}-${Date.now()}-${file.filename}`;
      const uploadPath = join(__dirname, "../../uploads", fileName);

      // Save the file to the upload directory
      const fileStream = createWriteStream(uploadPath);
      await file.file.pipe(fileStream); // Pipe the file data to the file stream

      // Update user's profile picture in the database
      const user = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: `/uploads/${fileName}` }, // Store file path
      });

      return reply.send({
        message: "Profile picture uploaded successfully",
        user,
      });
    }
  );
  // Register User
  fastify.post("/register", async (request, reply) => {
    const { name, email, password, role } = request.body as {
      name: string;
      email: string;
      password: string;
      role: string;
    };

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Save the user in the database
    try {
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
      return reply.status(201).send({
        message: "User created successfully",
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (error) {
      return reply.status(400).send({ message: "Email already exists" });
    }
  });

  // Login User
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(401).send({ message: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.send({ token });
  });
  // Protected Route (JWT required)
  fastify.get(
    "/protected",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      return reply.send({ message: "You are authenticated!" });
    }
  );
  // Protected Admin Route (Only admins can access this route)
  fastify.get(
    "/admin",
    { preValidation: [fastify.authenticate, authorizeRoles(["admin"])] },
    async (request, reply) => {
      return reply.send({ message: "Welcome, admin!" });
    }
  );
  // Create User
  fastify.post("/users", async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string };
    const user = await prisma.user.create({
      data: { name, email },
    });
    return reply.status(201).send(user);
  });
  // Get All Users
  fastify.get("/users", async (request, reply) => {
    const users = await prisma.user.findMany();
    return reply.send(users);
  });

  // Get a User by ID
  fastify.get("/users/:id", async (request, reply) => {
    const { id } = request.params as { id: number };
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    return reply.send(user);
  });

  // Update User
  fastify.put("/users/:id", async (request, reply) => {
    const { id } = request.params as { id: number };
    const { name, email } = request.body as { name: string; email: string };
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    return reply.send(user);
  });

  // Delete User
  fastify.delete("/users/:id", async (request, reply) => {
    const { id } = request.params as { id: number };
    await prisma.user.delete({
      where: { id },
    });
    return reply.status(204).send();
  });
};
