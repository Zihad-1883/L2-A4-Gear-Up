import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../../prisma/src/generated/prisma/client";
import config from "../config";

const connectionString = process.env.DATABASE_URL || config.DATABASE_URL;
const maskedUrl = connectionString ? connectionString.replace(/:([^@]+)@/, ":****@") : "NONE";
console.log(`[Database] Connecting to: ${maskedUrl}`);

if (!process.env.DATABASE_URL) {
  console.warn("[Database WARNING] process.env.DATABASE_URL is missing! Falling back to config.DATABASE_URL.");
}

const isLocalhost = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

const pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("[pg.Pool Error] Idle client error:", err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma, Prisma };
