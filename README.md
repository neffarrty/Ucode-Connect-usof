# BugTalk

<div>
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" height="30"/>
</div>

---

BugTalk is a Q&A web application built using NestJS. The platform is designed to enable developers to ask questions, share their knowledge, and assist each other in solving technical challenges. It serves as a hub for collaborative learning and problem-solving, fostering a community where expertise and insights can be exchanged.

## Technology Stack:

 - NestJS, Node.js
 - PostgreSQL
 - Redis
 - Prisma
 - JWT with Passport.js for secure user authentication.
 - Swagger for API documentation.

## Table of Contents

- [Technology Stack:](#technology-stack)
- [Table of Contents](#table-of-contents)
- [Dependencies](#dependencies)
- [Project setup](#project-setup)
  - [Database setup](#database-setup)
  - [Starting the server](#starting-the-server)
- [Admin panel](#admin-panel)
- [API Documentation](#api-documentation)
- [License](#license)

## Dependencies

The project relies on the following technologies:

 - [Node.js](https://nodejs.org/en) v16.x or higher.
 - [NPM](https://www.npmjs.com) v7.x or higher.
 - [PostgreSQL](https://www.postgresql.org) v13.x or higher.
 - [Redis](https://redis.io) v6.x or higher

If you don't have PostgreSQL and Redis installed on your local machine, you can run the application using Docker. The [docker-compose.yaml](./backend/docker-compose.yaml) file provided in the project will set up the necessary containers for you.

> [!NOTE] 
> Make sure you have [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

Start the containers by running the following command in your project directory:

```bash
$ docker-compose up -d
```

This command will start the PostgreSQL and Redis containers in the background.

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

### Database setup

Initialize the database and generate the Prisma client

```bash
$ npx prisma migrate dev --name init
$ npx prisma generate
```

Seed the database if required

```bash
$ npx prisma db seed
```

### Starting the server

To run the application locally, you'll need to start the server using the following command:

```bash
$ npm run start
```

Once the server has started successfully, the API will be accessible at http://localhost:3000/api.

## Admin panel

After starting the server, you can access the admin panel at http://localhost:3000/admin. Default admin user is generated during databse seeding and has the following credentials:

| Email             | Password |
|:------------------|:---------|
| admin@example.com | admin    |

Use these credentials to log in to the admin panel.

## API Documentation

The complete API reference can be accessed on [SwaggerHub](https://app.swaggerhub.com/apis-docs/EGORKOVTUN8/bug-talk_api/1.0).

If the server is running locally, you can also view the documentation at http://localhost:3000/docs. This URL provides access to the API endpoints and methods directly from your server environment, allowing you to test and interact with the API in real-time.

## License

Project is licensed under [MIT License](LICENSE).
