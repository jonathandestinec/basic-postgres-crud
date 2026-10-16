"use client";

import * as React from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "./ui/toast";
import { query } from "@/lib/data";
import { addPerson } from "@/server/addPerson";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  age: z.coerce
    .number()
    .min(1, "Age must be at least 1.")
    .max(120, "Please enter a valid age."),
});

type FormValues = z.infer<typeof formSchema>;

interface People {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  job: string;
  employed: boolean;
}

const formResolver: Resolver<FormValues> = async (values) => {
  const result = formSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors = Object.fromEntries(
    result.error.issues.map((issue) => [
      issue.path[0],
      {
        type: issue.code,
        message: issue.message,
      },
    ]),
  );

  return { values: {}, errors };
};

// the actual fucking component
export function Form() {
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: formResolver,
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "" as unknown as number,
      // Keeps initial input blank instead of showing 0
    },
  });

  async function onSubmit(data: FormValues) {
    // add user details to postgres table
    addPerson({ error: error, success: success }, data);

    toast.add({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Personal Info</CardTitle>
        <CardDescription>
          Please enter your first name, last name, and age.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="person-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* First Name Field */}
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    {...field}
                    id="firstName"
                    aria-invalid={fieldState.invalid}
                    placeholder="John"
                    autoComplete="given-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Last Name Field */}
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    {...field}
                    id="lastName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Age Field */}
            <Controller
              name="age"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="age">Age</FieldLabel>
                  <Input
                    {...field}
                    id="age"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="25"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="person-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
