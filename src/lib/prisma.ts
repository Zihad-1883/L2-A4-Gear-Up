import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma, Role } from "../../prisma/src/generated/prisma/index.js";
import config from "../config";

const connectionString = process.env.DATABASE_URL || config.DATABASE_URL;
const maskedUrl = connectionString ? connectionString.replace(/:([^@]+)@/, ":****@") : "NONE";
console.log(`[Database] Connecting to: ${maskedUrl}`);

if (!process.env.DATABASE_URL) {
  console.warn("[Database WARNING] process.env.DATABASE_URL is missing!");
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma, Prisma, Role };
