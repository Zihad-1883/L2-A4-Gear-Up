import { configDotenv } from "dotenv";
import { env } from "process";

configDotenv();

const config = {
  PORT: env.PORT || 5000,
  DATABASE_URL:
    env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/gearup",
};

export default config;
