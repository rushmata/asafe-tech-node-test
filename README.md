# asafe-tech-node-test - Fastify API with Prisma, JWT Authentication, and Unit Testing
This project is a Fastify-based API that uses Prisma ORM for database interaction, JWT for user authentication, and Jest for unit testing. It features two models: User and Post, which have a one-to-many relationship (one user can have multiple posts).

##### Table of Contents  
[Project Structure](#project-structure)  
[Installation](#installation)  
[Data base setup](#database-setup)  
[Authentication](#authentication)  
[Routes](#routes)  
[Testing](#testing)
[Architecture Overview](#architecture-overview)
[License](#license)
<a name="project-structure"/>
<a name="installation"/>
<a name="database-setup"/>
<a name="authentication"/>
<a name="routes"/>
<a name="testing"/>
<a name="architecture-overview"/>
<a name="license"/>

## Project Structure

.
|---prisma
│   ├── migrations              # Database migrations
│   └── schema.prisma           # Prisma schema
├── src
|   ├── config
│   │   └── aws.ts                  # aws auth config handler
|   ├── __tests__                   # Unit tests
│   |   ├── integration             # Integration tests
|   │   └── unit                    # Unit tests
│   ├── controllers
│   │   ├── fileController.ts    # Handles files upload either locally or sending to S3 bucket AWS
│   ├── middlewares
│   │   └── authenticate.js      # JWT authentication middleware
│   ├── routes
│   │   ├── fileRoutes.ts        # file routes (locally/AWS)
│   │   └── index.ts             # routes (user CRUD)
│   ├── services
│   │   ├── fileService.ts       # Business logic for uploading image files
│   ├── utils
│   │   └── fileValidator.ts     # Input validators
│   └── server.ts                   # Fastify server setup
├── package.json
└── README.md
