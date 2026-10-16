import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const u = new URL(url);
console.log("host:", u.host, "| db:", u.pathname, "| user length:", u.username.length);

const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10000 });

try {
  await client.connect();
  console.log("connected");
  console.log((await client.query("select now(), current_database()")).rows[0]);
} catch (e) {
  console.error("FAILED:", e.code ?? "", e.message);
  if (e instanceof AggregateError) console.error(e.errors);
} finally {
  await client.end().catch(() => {});
}