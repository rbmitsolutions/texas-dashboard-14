import { z } from "zod";

export const RoleFormSchema = z.object({
    title: z.string().min(3 , {message: 'Title must be at least 3 characters long'}),
    departament_id: z.string().min(3 , {message: 'Select a departament'}),
    permissions: z.array(z.string()).min(1 , {message: 'Select at least one permission'}),
});

export type RoleFormSchemaType = z.infer<typeof RoleFormSchema>;
