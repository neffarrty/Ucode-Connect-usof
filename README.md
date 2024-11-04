# BugTalk

<div>
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" height="30"/>
</div>

---

BugTalk is a Q&A web application built using NestJS. The platform is designed to enable developers to ask questions, share their knowledge, and assist each other in solving technical challenges. It serves as a hub for collaborative learning and problem-solving, fostering a community where expertise and insights can be exchanged.

## Technology Stack:

 - NestJS, Node.js
 - PostgreSQL
 - Prisma
 - JWT with Passport.js for secure user authentication.
 - Swagger for API documentation.

## Table of Contents

- [BugTalk](#bugtalk)
  - [Technology Stack:](#technology-stack)
  - [Table of Contents](#table-of-contents)
  - [Dependencies](#dependencies)
  - [Project setup](#project-setup)
  - [Admin panel](#admin-panel)
  - [API Documentation](#api-documentation)
  - [License](#license)

## Dependencies

The project relies on the following technologies:

 - [Node.js](https://nodejs.org/en) v16.x or higher.
 - [NPM](https://www.npmjs.com) 7.x or higher.
 - [PostgreSQL](https://www.postgresql.org) v13.x or higher.

## Project setup

Clone the project to your local machine

```bash
$ git clone https://github.com/neffarrty/Ucode-Connect-usof.git
```

Go to the project directory

```bash
$ cd Ucode-Connect-usof/
```

Copy the example .env file and fill in any necessary values

```bash
$ cp .env.example .env
```

Install project dependencies

```bash
$ npm install
```

Initialize the database and generate the Prisma client

```bash
$ npx prisma migrate dev --name init
$ npx prisma generate
```

Seed the database if required

```bash
$ npx prisma db seed
```

Run the server

```bash
$ npm run start:dev
```

Once the server has started, the API will be available at http://localhost:3000.

## Admin panel

After starting the server, you can access the admin panel at http://localhost:3000/admin. Admin user is generated during databse seeding and has the following credentials:

| Email             | Password |
|:------------------|:---------|
| admin@example.com | admin    |

Use these credentials to log in to the admin panel.

## API Documentation

For the full API reference, visit the documentation on [SwaggerHub](https://app.swaggerhub.com/apis/EGORKOVTUN8/bug-talk/1.0).

## License

Project is licensed under [MIT License](LICENSE).
