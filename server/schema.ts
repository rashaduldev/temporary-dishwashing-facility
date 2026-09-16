import { z } from "zod";
export const leadSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(100),
    email: z.email("Enter a valid email address.").max(254),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a phone number.")
      .max(30)
      .regex(/^[+()\d\s.-]*$/, "Enter a valid phone number."),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a rental date."),
    location: z.string().trim().min(2, "Enter your project location.").max(160),
    service: z.enum([
      "mobile-kitchens",
      "restroom-shower-trailers",
      "workforce-housing",
      "temporary-facilities",
      "multiple",
    ]),
    duration: z.enum([
      "under-1-month",
      "1-3-months",
      "3-6-months",
      "6-plus-months",
      "not-sure",
    ]),
    industry: z.enum([
      "construction",
      "government",
      "food-service",
      "emergency-response",
      "other",
    ]),
    message: z
      .string()
      .trim()
      .min(20, "Please provide at least 20 characters of project detail.")
      .max(3000),
    consent: z.literal(true),
    website: z.string().max(0, "Unable to accept this inquiry.").default(""),
    page: z.literal("/contact/"),
  })
  .strict();
export type Lead = z.infer<typeof leadSchema>;
