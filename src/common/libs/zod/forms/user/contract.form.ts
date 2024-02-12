import { z } from "zod";

export const UserContractFormSchema = z.object({
    address: z.string().min(3, {
        message: 'Please enter an address'
    }),
    contact_number: z.string().min(3, {
        message: 'Please enter a contact number'
    }),
    pps_number: z.string().min(3, {
        message: 'Please enter a PPS Number'
    }),
    signature: z.string().min(3, {
        message: "Please enter a signature",
    }),
});

export type UserContractFormSchemaType = z.infer<typeof UserContractFormSchema>;
