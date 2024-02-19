import { z } from "zod";

const forbiddenPasswordsRegex = /^(?!.*(texas|texassteak|steakout|texassteakout))(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[\w@#$%^&*()+=[\]{}|;:'",.<>/?\\~-]+$/;

export const ChangePasswordFormSchema = z.object({
    password: z
        .string()
        .describe("New password")
        .regex(forbiddenPasswordsRegex, {
            message: "Password must contain at least one letter, one number, and one special character and it can not contain the word 'texas', 'texassteak', 'steakout', or 'texassteakout'.",
        })
        .min(6, { message: "Password must be at least 6 characters long" }),
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
