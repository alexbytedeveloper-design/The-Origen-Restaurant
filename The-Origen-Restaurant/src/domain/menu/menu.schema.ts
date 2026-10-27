import { z } from "zod";

const localizedTextSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

const dishSchema = z
  .object({
    id: z.string().min(1),
    name: localizedTextSchema,
    description: localizedTextSchema,
    price: z.number().nonnegative().nullable(),
    currency: z.literal("USD"),
    image: z.string().min(1).nullable(),
    imageAlt: localizedTextSchema.nullable(),
    isRecommended: z.boolean(),
    isNote: z.boolean(),
    sortOrder: z.number().int().nonnegative(),
  })
  .superRefine((dish, context) => {
    if (!dish.isNote && (dish.price === null || dish.image === null || dish.imageAlt === null)) {
      context.addIssue({
        code: "custom",
        message: `Dish ${dish.id} must have a price, an image and alt text.`,
      });
    }
    if (dish.isNote && dish.price !== null) {
      context.addIssue({
        code: "custom",
        message: `Note ${dish.id} cannot have a price.`,
      });
    }
  });

const sectionSchema = z.object({
  id: z.string().min(1),
  name: localizedTextSchema,
  showHeading: z.boolean(),
  dishes: z.array(dishSchema).min(1),
});

const categorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: localizedTextSchema,
  tagline: localizedTextSchema,
  sortOrder: z.number().int().nonnegative(),
  sections: z.array(sectionSchema).min(1),
});

export const menuDocumentSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string().min(1),
  currency: z.literal("USD"),
  categories: z.array(categorySchema).min(1),
});

export type MenuDocumentInput = z.input<typeof menuDocumentSchema>;
