"use server"

import { query } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function updatePerson(
  id: number,
  toUpdate: "first_name" | "last_name" | "age" | "employment",
  value: string | number,
) {
  try {
    await query("update people set $1=$2 where id=$3", [toUpdate, value, id]);
  } catch (e) {
    if ((e as { code?: string }).code === "23505") {
      return { error: "That email is already registered." };
    }
    throw e;
  }

  revalidatePath("/");
}
