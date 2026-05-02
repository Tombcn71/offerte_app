// lib/db.ts
import postgres from "postgres";

// Haal de connection string uit je .env bestand
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is niet ingesteld in je .env bestand");
}

// Voor Next.js (Hot Reloading) zorgen we dat we niet elke keer een nieuwe pool aanmaken
const globalForSql = global as unknown as { sql: postgres.Sql | undefined };

export const sql =
  globalForSql.sql ??
  postgres(connectionString, {
    ssl: "require", // Neon vereist SSL
  });

if (process.env.NODE_ENV !== "production") globalForSql.sql = sql;
