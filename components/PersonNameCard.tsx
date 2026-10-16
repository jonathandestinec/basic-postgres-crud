"use client";

import React, { useState, useTransition } from "react";
import { deletePerson } from "@/server/deletePerson";
import { updatePerson } from "@/server/updatePerson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Person {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  job: string;
  employed: boolean;
}

export default function PersonNameCard({ person }: { person: Person }) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(person.first_name);
  const [lastName, setLastName] = useState(person.last_name);
  const [age, setAge] = useState(String(person.age));
  const [job, setJob] = useState(person.job);
  const [employed, setEmployed] = useState(person.employed);

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deletePerson(person.id);
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      // Pass the updated details to your server action
      await updatePerson(person.id, {
        first_name: firstName,
        last_name: lastName,
        age: Number(age),
        employed: employed,
        job: job,
      });
      setIsEditing(false);
    });
  };

  return (
    <Card className="w-full max-w-xl transition-all shadow-sm hover:shadow-md">
      <CardContent className="p-5">
        {isEditing ? (
          /* --- EDIT FORM VIEW --- */
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  First Name
                </label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Last Name
                </label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Age
                </label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Job
                </label>
                <Input
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          /* --- DISPLAY VIEW --- */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">
                  {person.first_name} {person.last_name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                  Age: {person.age}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${person.employed ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                >
                  {person.employed ? "Employed" : "Unemployed"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Job:</span>{" "}
                {person.job || "Not specified"}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
