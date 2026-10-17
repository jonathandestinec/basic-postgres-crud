import { Form } from "@/components/Form";
import PersonNameCard from "@/components/PersonNameCard";
import { query } from "@/lib/data";
import { createTable } from "@/server/createTable";
import React, { Suspense } from "react";

interface People {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  job: string;
  employed: boolean;
}

export default function Page() {
  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">People Directory</h1>

      <Suspense
        fallback={
          <div className="text-muted-foreground">
            Loading People from postgres db...
          </div>
        }
      >
        <UsersList />
      </Suspense>

      <div className="pt-4 border-t">
        <h2 className="text-lg font-semibold mb-3">Add New Person</h2>
        <Form />
      </div>
    </main>
  );
}

async function UsersList() {
  // await createTable();

  const { rows: rawRows } = await query(
    "SELECT * FROM people ORDER BY id DESC",
  );
  const rows: People[] = JSON.parse(JSON.stringify(rawRows));

  return (
    <div className="space-y-3">
      {rows.map(
        (person) =>
          person.id && <PersonNameCard key={person.id} person={person} />,
      )}
    </div>
  );
}
