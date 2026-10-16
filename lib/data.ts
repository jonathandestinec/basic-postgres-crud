import "server-only";
import { Pool, type QueryResult, type QueryResultRow } from "pg";
import { connection } from "next/server";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const globalForPg = globalThis as unknown as { pool?: Pool };

export const pool =
  globalForPg.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  await connection();
  const start = Date.now();
  const res = await pool.query<T>(text, params);

  if (process.env.NODE_ENV !== "production") {
    console.log("Executed query", {
      text,
      duration: Date.now() - start,
      rows: res.rowCount,
    });
  }
  return res;
}