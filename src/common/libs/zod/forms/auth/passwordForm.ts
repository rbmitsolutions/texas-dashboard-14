import { z } from "zod";

export const ChangePasswordFormSchema = z.object({
    password: z
        .string()
        .describe("New password")
        .min(3, { message: "New password is required." }),
    confirmPassword: z.string().describe("Confirm new password").min(3, { message: "Confirm new password is required." }),
}).superRefine((data, x) => {
    if (data?.password !== data?.confirmPassword) {
        return x.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        })
    }
})

export type ChangePasswordFormSchemaType = z.infer<typeof ChangePasswordFormSchema>;
