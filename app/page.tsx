import { Form } from "@/components/Form";
import PersonNameCard from "@/components/PersonNameCard";
import { query } from "@/lib/data";
import { deletePerson } from "@/server/deletePerson";
import React, { Suspense } from "react";

interface People {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  job: string;
  employed: boolean;
}

const page = () => {
  return (
    <div>
      People List.
      <Suspense fallback="Loading People from postgres db">
        <UsersList />
      </Suspense>
      <Form />
    </div>
  );
};

async function UsersList() {
  const { rows: rawRows } = await query("select * from people");
  const rows: People[] = JSON.parse(JSON.stringify(rawRows));

  console.log(rows, "Rowss");

  return (
    <div>
      {rows.map(
        (person) =>
          person.id && (
            <div key={person.id}>
              <PersonNameCard person={person} />
            </div>
          ),
      )}
    </div>
  );
}

export default page;
