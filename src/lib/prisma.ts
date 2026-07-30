import "dotenv/config";
import dns from "node:dns";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../../prisma/src/generated/prisma/client";
import config from "../config";

// Force Node.js to use IPv4 first for DNS lookup (prevents ECONNREFUSED on cloud providers like Render that do not support outbound IPv6)
dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL || config.DATABASE_URL;
const maskedUrl = connectionString ? connectionString.replace(/:([^@]+)@/, ":****@") : "NONE";
console.log(`[Database] Connecting to: ${maskedUrl}`);

if (!process.env.DATABASE_URL) {
  console.warn("[Database WARNING] process.env.DATABASE_URL is missing! Falling back to config.DATABASE_URL.");
}

const isLocalhost = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

let dbHost = "";
try {
  if (connectionString) {
    dbHost = new URL(connectionString).hostname;
  }
} catch (e) {
  // Ignore URL parse error if malformed
}

const pool = new pg.Pool({
  connectionString,
  ssl: isLocalhost
    ? false
    : {
        rejectUnauthorized: false,
        servername: dbHost || undefined,
      },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma, Prisma };

