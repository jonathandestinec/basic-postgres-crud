"use server";

import { query } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function deletePerson(personId: number) {
  try {
    await query("delete from people where id=$1", [personId]);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "23505") {
      return { error: "That email is already registered." };
    }
    throw e;
  }

  revalidatePath("/"); // re-render the page so the new row shows up
}
