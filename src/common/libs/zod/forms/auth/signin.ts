import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.string().describe("email").email({ message: "Invalid email" }),
  password: z
    .string()
    .describe("Password")
    .min(3, { message: "Paswword is required." }),
});

export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;
