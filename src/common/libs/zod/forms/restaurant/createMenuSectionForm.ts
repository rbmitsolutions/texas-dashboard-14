import { z } from "zod";

export const CreateMenuSectionFormSchema = z.object({
    title: z.string().min(3, {
        message: "The title must be at least 3 characters long",
    }),
    bg_color: z.string().min(3, {
        message: "Select a color for the menu section",
    }),
});

export type CreateMenuSectionFormSchemaType = z.infer<typeof CreateMenuSectionFormSchema>;
