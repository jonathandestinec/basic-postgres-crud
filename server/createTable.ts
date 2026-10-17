import { query } from "@/lib/data";

export async function createTable() {
  try {
    await query(`CREATE TABLE IF NOT EXISTS people (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	age INT,
	job VARCHAR(255),
	employed BOOL
);`);
  } catch (e) {
    if ((e as { code?: string }).code === "23505") {
      return { error: "That email is already registered." };
    }
    throw e;
  }
}
