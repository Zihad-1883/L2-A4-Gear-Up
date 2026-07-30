import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../../prisma/src/generated/prisma/client";
import config from "../config";

const connectionString = config.DATABASE_URL;
const isLocalhost = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

const pool = new pg.Pool({
  connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma, Prisma };


