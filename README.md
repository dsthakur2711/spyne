# Spyne SDE Project Backend Documentation

## Overview

This repository contains the backend code for the SDE 1 project submission for SPYNE, developed by Arnav Sharma. The project is primarily written in TypeScript, with some HTML and JavaScript components. The project setup includes various configurations for linting, testing, and containerization.
The Spyne SDE Project Backend is a server-side application designed to handle and process requests for the Spyne project. It provides a set of APIs to manage and interact with the application's data and services.

## Features
- RESTful API endpoints for managing resources
- Authentication and authorization mechanisms
- Integration with a database for persistent storage
- Error handling and logging
- Scalable and modular architecture

## Repository Structure

```
spyne-sde-project-backend/
├── api/
├── migrations/
├── public/
├── src/
├── test/
├── .env.sample
├── .eslintignore
├── .eslintrc.js
├── .gitattributes
├── .gitignore
├── .prettierrc.js
├── README.md
├── docker-compose.yaml
├── drizzle.config.ts
├── jest.config.js
├── package.json
├── tsconfig.json
└── vercel.json
```

### Directory Details

- **api/**: Contains API endpoint definitions and related logic.
- **migrations/**: Database migration files.
- **public/**: Static assets and public files.
- **src/**: Main source code including application logic, models, controllers, and services.
- **test/**: Test cases and testing utilities.

### Configuration Files

- **.env.sample**: Sample environment configuration file.
- **.eslintignore**: Specifies files and directories that ESLint should ignore.
- **.eslintrc.js**: ESLint configuration file.
- **.gitattributes**: Git attributes configuration.
- **.gitignore**: Specifies files and directories that Git should ignore.
- **.prettierrc.js**: Prettier configuration for code formatting.
- **README.md**: Project overview and documentation (current document).
- **docker-compose.yaml**: Docker Compose configuration for containerized environment setup.
- **drizzle.config.ts**: Configuration for Drizzle ORM.
- **jest.config.js**: Jest configuration for testing.
- **package.json**: Node.js project metadata and dependencies.
- **tsconfig.json**: TypeScript configuration file.
- **vercel.json**: Configuration for deployment on Vercel.

## Setup and Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/arnavsharma2711/spyne-sde-project-backend.git
   cd spyne-sde-project-backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Setup environment variables:**

   Copy `.env.sample` to `.env` and configure the environment variables.

   ```sh
   cp .env.sample .env
   ```

4. **Run the application:**

   ```sh
   npm start
   ```

5. **Run with Docker:**

   Ensure Docker and Docker Compose are installed, then run:

   ```sh
   docker-compose up
   ```

## Technologies Used

- **Language**: TypeScript
- **Environment**: Node
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Deployment**: Vercel
