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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "./ui/toast";
import { query } from "@/lib/data";
import { addPerson } from "@/server/addPerson";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  age: z.coerce
    .number()
    .min(1, "Age must be at least 1.")
    .max(120, "Please enter a valid age."),
  isEmployed: z.enum(["Employed", "Unemployed"]),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters."),
});

type FormValues = z.infer<typeof formSchema>;

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
      isEmployed: "Employed",
      jobTitle: "",
      // Keeps initial input blank instead of showing 0
    },
  });

  async function onSubmit(data: FormValues) {
    // add user details to postgres table
    addPerson({ error: error, success: success }, data);

    toast.add({
      title: "You submitted the form"
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

            {/* Job Title Field */}
            <Controller
              name="jobTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="JobTitle">Job</FieldLabel>
                  <Input
                    {...field}
                    id="jobTitle"
                    aria-invalid={fieldState.invalid}
                    placeholder="Software Developer"
                    autoComplete="job"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Employment status field */}
            <Controller
              name="isEmployed"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-complex-billingPeriod">
                    Employment Status
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-complex-billingPeriod"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employed">Employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
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
