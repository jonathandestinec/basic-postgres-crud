"use client";

import React from "react";
import { deletePerson } from "@/server/deletePerson";
import { updatePerson } from "@/server/updatePerson";

interface Person {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  job: string;
  employed: boolean;
}

const PersonNameCard = ({ person }: { person: Person }) => {
  return (
    <div className="flex items-center justify-between gap-8 w-max">
      <div>{person.first_name}</div>
      <button
        className="cursor-pointer"
        onClick={async () => {
          await deletePerson(person.id);
        }}
      >
        Delete
      </button>

      <button
        onClick={async () => {
          await updatePerson(person.id, "first_name", "");
        }}
      >
        Edit
      </button>
    </div>
  );
};

export default PersonNameCard;
