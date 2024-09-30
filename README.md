# asafe-tech-node-test - Fastify API with Prisma, JWT Authentication, and Unit Testing #
This project is a Fastify-based API that uses Prisma ORM for database interaction, JWT for user authentication, and Jest for unit testing. It features two models: User and Post, which have a one-to-many relationship (one user can have multiple posts).
## Table of Contents ##
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Steps](#steps)
- [Database setup](#database-setup)
- [Authentication](#authentication)
- [Routes](#routes)
- [Testing](#testing)
- [Architecture Overview](#architecture-overview)
  
## Project Structure ##

<pre><code>.
|---prisma
│   ├── migrations              # Database migrations
│   └── schema.prisma           # Prisma schema
├── src
|   ├── config
│   │   └── aws.ts                  # aws auth config handler
|   ├── __tests__                   # Unit tests
│   |   ├── integration             # Integration tests
|   │   └── unit                    # Unit tests
│   ├── plugins
│   |   ├── authorization           # Handles the authorization roles for users
│   |   ├── sensible                # to register fastify sensible in the server
        └── cors.ts                 # to avoid cross domains
│   ├── controllers
│   │   ├── fileController.ts    # Handles files upload either locally or sending to S3 bucket AWS
        └── postController.ts    # Business logic for posts
│   ├── middlewares
│   │   └── authenticate.js      # JWT authentication middleware
│   ├── routes
│   │   ├── userRoutes.ts        # user Routes (user CRUD)
│   │   ├── fileRoutes.ts        # file routes (locally/AWS)
│   │   └── postRoutes.ts        # post routes (post Create and Read)
│   ├── services
│   │   ├── fileService.ts       # Business logic for uploading image files
        └── postService.ts       # Creation or reading from DDBB 
    ├── types                    # polyfil for typings needed
│   ├── utils
│   │   └── fileValidator.ts     # Input validators
│   └── server.ts                   # Fastify server setup
├── package.json
└── README.md</code></pre>

## Installation ## 
### Prerequisites ###
* Node.js (v14+)
* PostgreSQL or MySQL database
* Prisma CLI installed globally (<code>npm install -g prisma</code>)

### Steps ###
1. Clone the repository:
<pre><code>
git clone https://github.com/asafenodetechtest.git
cd asafenodetechtest
</code></pre>
2. Install dependencies:
<pre><code>
    npm install
</code></pre>
3. Configure environment variables: Create a .env file in the root directory and configure your environment variables:
<pre><code>
    DATABASE_URL="postgresql://postgres:123456@localhost:5433/Asafenodetechtest?schema=public"
    JWT_SECRET="your_jwt_secret"
    AWS_ACCESS_KEY_ID="Request it to the Owner of the project"
    AWS_SECRET_ACCESS_KEY="The AWS secret access key, request to the Owner of the project"
    AWS_REGION="us-east-1"
    AWS_S3_BUCKET_NAME="asafe-node-tech-test"
</code></pre>
4. Set up the Prisma schema:
<pre><code>
    npx prisma migrate dev --name init
    npx prisma generate
</code></pre>
5. Run the server:
<pre><code>
    npx prisma migrate dev --name init
    npx prisma generate
</code></pre>

## Database setup ##
Prisma is used to interact with the database. Below are the two models defined in schema.prisma.
<pre><code>
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
  posts    Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
</code></pre>
A `User` can have multiple `Posts`, but each `Post` belongs to one `User`.

## Authentication ##
Authentication is handled using JWT. After a user logs in or registers, a JWT token is generated, which must be sent with subsequent requests that require authentication (e.g., creating a post).

JWT Secret: Defined in .env as JWT_SECRET.
Token Expiry: Set to 1h by default in the JWT utility.

### JWT middleware ### 
plugins/authorization.ts ensures that protected routes can only be accessed by authenticated users.

## Routes ## 
- File Routes (src/routes/fileRoutes.js)
  - POST /upload-profile-picture-aws: upload jpg to S3 bucket AWS
  - POST /upload-profile-picture: upload jpg to uploads folder locally  ;
- Post Routes (src/routes/postRoutes.js)
  - POST /create-post: Create a new post (protected, requires JWT)
  - GET /posts: Fetch all posts (public route)
- Auth Routes (src/routes/userRoutes.js)
  - POST /register: Register a new user
  - POST /login: Login and retrieve a JWT token
  - GET  /protected: Protected Route (JWT required)
  - GET  /admin: Protected Admin Route (Only admins can access this route)
- User Routes (src/routes/userRoutes.js)
  - GET /users: Fetch all users (public route)
  - GET /users:id Fetch a user by id as a path param (public route)
  - PUT /users:id Update a user by id as a path param (public route)
  - DELETE /users:id Delete a user by id (protected, requires JWT)

### Example Route: Create Post ### 
<pre><code>
import { authorizeRoles } from "../plugins/authorization";

fastify.get(
    "/admin",
    { preValidation: [fastify.authenticate, authorizeRoles(["admin"])] },
    async (request, reply) => {
      return reply.send({ message: "Welcome, admin!" });
    }
  );
</code></pre>

## Testing ## 

## Architecture Overview ##
1. ### Controllers ###
Controllers handle HTTP requests and responses. They delegate the business logic to services and return the result or error.
fileController.js: Handles files upload.

2. ### Services ###
Services contain the core business logic of the application. They interact with the database using Prisma.

fileService.js: In this specific case this service is Responsible to upload files to the S3 bucket only, but we can create more services to handle the user login for instance.

3. ### Utilities ###
Utilities provide helper functions used across the application.
jwt.js: Contains functions for signing and verifying JWT tokens.
validators.js: Input validation logic to ensure correct data formats.

4. ### Middlewares ###
Custom middlewares such as authorization.ts are used to protect routes by verifying JWT tokens. It's being created as a plugin of the application.

5. ### Routes ###
The application is split into modular route files for better organization. Each route file handles a specific set of endpoints (e.g., authentication or users).

6. ### Prisma ORM ### 
Prisma provides a type-safe API for database access. The Prisma client is generated from the schema and is used in the services to perform database operations.

## License ## 
This project has been create as a technical test for a-safe company, no license.

## Conclusion ##
This Fastify-based application provides a scalable and maintainable structure with Prisma for database management, JWT for authentication, and thorough unit testing via Jest. It follows best practices for organizing services, controllers, and utilities, ensuring it is both modular and easy to extend in the future.

