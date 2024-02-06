import { z } from "zod";

export const CreateMenuFormSchema = z.object({
    title: z.string().min(3, {
        message: "The title must be at least 3 characters long",
    }),
    short_title: z.string().min(3, {
        message: "The short title must be at least 3 characters long",
    }),
    description: z.string().optional(),
    thumbnail: z.string().optional(),

    value: z.number(),
    profit: z.number().min(0.01, {
        message: "Minimum 0.01",
    }).max(100, {
        message: "Maximum 100",
    }),
    images: z.array(z.string()).optional(),

    mn_type_id: z.string().min(3, {
        message: "Select a menu type",
    }),

    to_print_ids: z.array(z.string()),

    website: z.boolean(),
    to_order: z.boolean(),

    options_priority: z.string(),
    add_ons: z.array(z.string()),
    allergens: z.array(z.string()),
    go_with_ids: z.array(z.string()),
    f_options: z.array(z.string()),
    // stock_items: z.array(z.string()).optional(), do it later when u have stock system

});

export type CreateMenuFormSchemaType = z.infer<typeof CreateMenuFormSchema>;