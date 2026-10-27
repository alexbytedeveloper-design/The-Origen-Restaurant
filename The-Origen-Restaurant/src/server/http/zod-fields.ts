import type { ZodError } from "zod";

export const mapZodIssues = (error: ZodError): Record<string, string> => {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string" || key === "website") continue;
    if (fields[key] === undefined) {
      fields[key] = issue.message;
    }
  }
  return fields;
};
