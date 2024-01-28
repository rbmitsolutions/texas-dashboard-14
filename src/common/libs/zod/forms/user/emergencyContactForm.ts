import { z } from "zod";

export const EmergencyContactFormSchema = z.object({
    emergency_name: z.string().min(3, {
        message: "Please enter a valid name",
    }),
    emergency_email: z.string().email({
        message: "Please enter a valid email",
    }),
    emergency_contact_number: z.string().min(6, {
        message: "Please enter a valid contact number",
    }),
    emergency_adress: z.string().min(3, {
        message: "Please enter a valid address",
    }),
    emergency_city: z.string().min(3, {
        message: "Please enter a valid city",
    }),
    emergency_country: z.string().min(3, {
        message: "Please enter a valid country",
    }),
});

export type EmergencyContactFormSchemaType = z.infer<typeof EmergencyContactFormSchema>;
