# Life Planner

Life Planner is a monorepo application: a web dashboard for planning your day, a NestJS API with Prisma and PostgreSQL, and an OpenAPI-generated TypeScript client. Created by Denys Nykoriak.

## Motivation

A pet project for planning your day with simple gamification so it stays fun to hit new “tops.” Mostly I wanted to see if I can grow a codebase where the AI writes almost all of the code and I only work through prompts and docs.

## Documentation

All project docs are written by me, using what worked in earlier projects as a baseline. I extend them over time while I try different techniques and keep what proves useful.

## Repo structure

| Directory                                   | Description                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| [services/dashboard/](./services/dashboard) | Web client (React + Vite, Mantine, TanStack Router & Query, drag-and-drop planner UI). |
| [services/api/](./services/api)             | NestJS REST API, Better Auth, Prisma schema and migrations.                            |
| [libs/api-client/](./libs/api-client)       | Generated TypeScript client from the API OpenAPI spec (`openapi.json`).                |

## Getting started

1. Install dependencies from the repo root: `npm install`.
2. Run PostgreSQL locally (or point `DATABASE_URL` at your instance).
3. Copy env files: `services/api/.env.example` → `services/api/.env`, and `services/dashboard/.env.example` → `services/dashboard/.env`. Adjust values as needed.
4. Apply the database schema: `npm run db:push` (or use Prisma migrate in `services/api` for migration-based workflows).
5. Start the API: `npm run api:dev`.
6. Start the dashboard: `npm run web:dev` (default Vite URL is `http://localhost:5173`).
7. After OpenAPI changes, regenerate the client: `npm run client:generate`, then `npm run build -w @life-planner/api-client` if you need compiled output.

## Technologies

| Layer     | Stack                                                                       |
| --------- | --------------------------------------------------------------------------- |
| Dashboard | React, Vite, Mantine, TanStack Router, TanStack Query, Better Auth, DnD Kit |
| API       | NestJS, Prisma, PostgreSQL, Better Auth                                     |
| Client    | OpenAPI Generator, TypeScript (`typescript-fetch`)                          |
| Monorepo  | npm workspaces, Biome                                                       |
