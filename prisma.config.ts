import "dotenv/config";
import { defineConfig } from "prisma/config";

// generate only needs a valid URL shape, not a live database
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://localhost:5432/prisma?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
