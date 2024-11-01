# BugTalk

<div>
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" height="30"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" height="30"/>
</div>

A brief description of what this project does and who it's for

## Table of Contents

- [BugTalk](#bugtalk)
  - [Table of Contents](#table-of-contents)
  - [Project setup](#project-setup)
  - [API Documentation](#api-documentation)
  - [License](#license)

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

Start the server

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Visit the [Documentation](https://docs.nestjs.com) to learn more about the framework.

## License

Project is licensed under [MIT License](LICENSE).
