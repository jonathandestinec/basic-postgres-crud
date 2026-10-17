"use server";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/data";

type State = { error?: string; success?: boolean } | null;

export async function addPerson(
  _prev: State,
  formData: {
    firstName: string;
    lastName: string;
    age: number;
    isEmployed: "Employed" | "Unemployed";
    jobTitle: string;
  },
): Promise<State> {
  const firstName = String(formData.firstName ?? "").trim();
  const lastName = String(formData.lastName ?? "");
  const age = String(formData.age ?? "");
  const isEmployed = String(formData.isEmployed ?? "").trim();
  const jobTitle = String(formData.jobTitle ?? "").trim();

  const employmentStatus = isEmployed === "Employed" ? true : false;

  if (!firstName || !lastName || !age) {
    return { error: "Enter a name and a valid email." };
  }

  try {
    await query(
      "INSERT INTO people (first_name, last_name, age, employed, job) VALUES ($1, $2, $3, $4, $5)",
      [firstName, lastName, age, employmentStatus, jobTitle],
    );
  } catch (e: unknown) {
    // 23505 = unique_violation in Postgres
    if ((e as { code?: string }).code === "23505") {
      return { error: "That email is already registered." };
    }
    throw e;
  }

  revalidatePath("/"); // re-render the page so the new row shows up
  return { success: true };
}
