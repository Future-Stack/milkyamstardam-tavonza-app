# Project Getting Started Guide

Welcome to the project! This guide provides step-by-step instructions on how to set up and run the application from the provided ZIP file.

## Prerequisites

Before starting, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (Version 24 or higher recommended)
- [pnpm](https://pnpm.io/installation) (Version 11.25.0 is specified in this project)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/) (Required if you want to run the app via Docker)

---

## 1. Extract the ZIP File
First, unzip the downloaded code file into your desired directory, then open your terminal and navigate to the project's root folder:
```bash
cd path/to/extracted/folder
```

---

## 2. Environment Variables Setup
The project requires a `.env` file to configure environment variables (like database URLs, API keys, etc.).

If a `.env` file is not already present, you may need to copy from an `.env.example` file (if provided) or fill in the required variables as per the development requirements.

---

## 3. Starting the Project

You can run the project in two ways: **Local Development Mode** (recommended for coding/testing) or **Docker Mode** (recommended for simple running/deployment).

### Option A: Local Development (Using pnpm)

This project uses **Turborepo** to manage multiple applications and packages.

1. **Install dependencies:**
   Run the following command at the root of the project to install all required packages:
   ```bash
   pnpm install
   ```

2. **Start the development servers:**
   To run all applications concurrently, simply execute:
   ```bash
   pnpm dev
   ```
   This command starts all applications:
   - **Main Web Frontend:** `http://localhost:3000`
   - **Customer Portal:** `http://localhost:3001`
   - **System Admin Portal:** `http://localhost:3002`
   - **Backend API:** `http://localhost:7777`

### Option B: Using Docker Compose

If you prefer to run everything in containers (including the MongoDB database) without installing local Node.js dependencies, you can use Docker.

1. Ensure Docker Desktop is running on your machine.
2. Run the following command to build and start all services in detached mode:
   ```bash
   docker compose up --build -d
   ```
3. Wait a few moments for all containers to initialize. You can access the applications at:
   - **Main Web Frontend:** `http://localhost:3000`
   - **Customer Portal:** `http://localhost:3001`
   - **System Admin Portal:** `http://localhost:3002`
   - **Backend API:** `http://localhost:7777`
   - **Mongo Express (Database GUI):** `http://localhost:8081`

To stop the Docker containers, run:
```bash
docker compose down
```

---

## Architecture Overview

This repository is a monorepo containing several applications under the `apps/` directory:
- `backend`: NestJS + Prisma backend API
- `web`: Next.js Main Web Frontend
- `customer`: Next.js Customer Portal
- `system-admin`: Next.js System Admin Portal

## Troubleshooting

- **Port Conflicts**: Ensure ports 3000, 3001, 3002, 7777, 27017, and 8081 are not already in use by other programs.
- **Node Version Error**: Ensure you are using Node.js version >= 24 as enforced by the `package.json` engines field. Use `nvm` (Node Version Manager) to switch versions if necessary.
