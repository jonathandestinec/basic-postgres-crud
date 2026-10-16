"use server";

import { query } from "@/lib/data";
import { revalidatePath } from "next/cache";

interface Person {
  first_name: string;
  last_name: string;
  age: number;
  job: string;
  employed: boolean;
}

export async function updatePerson(
  id: number,
  data: Person,
) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) {
      throw new Error("No fields provided for update");
    }

    // 1. Build the SET clause dynamically using parameter indexes ($1, $2, etc.)
    // e.g., "first_name = $1, last_name = $2, age = $3"
    const setString = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    // 2. Push the ID to the end of the values array so it matches the final placeholder index
    values.push(id);
    const idPlaceholderIndex = values.length;

    // 3. Construct the final query string safely
    const queryString = `UPDATE people SET ${setString} WHERE id = $${idPlaceholderIndex}`;

    await query(queryString, values);
  } catch (e) {
    if ((e as { code?: string }).code === "23505") {
      return { error: "That email is already registered." };
    }
    throw e;
  }

  revalidatePath("/");
}
