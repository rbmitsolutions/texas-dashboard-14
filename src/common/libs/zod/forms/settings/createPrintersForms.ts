import { z } from "zod";

const isIpAddress = (ip: string) => {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
};

export const CreatePrintersFormSchema = z.object({
    title: z.string().min(3, {
        message: "The title must be at least 3 characters long",
    }),
    description: z.string().optional(),
    ip: z.string().refine((value) => isIpAddress(value), {
        message: "Invalid IP address format",
    }),
});

export type CreatePrintersFormSchemaType = z.infer<typeof CreatePrintersFormSchema>;


