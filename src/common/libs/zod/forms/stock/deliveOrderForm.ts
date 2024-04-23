import { z } from "zod";

export enum PackagingOptions {
    PoorRejected = 'Poor Rejected',
    PoorAccepted = 'Poor Accepted',
    OkCouldBeBetter = 'Ok Could Be Better',
    Normal = 'Normal',
    Average = 'Average',
    Good = 'Good',
    Excellent = 'Excellent',
}

export enum DeliveryVehicle {
    Poor = 'Poor',
    Ok = 'Ok',
    Normal = 'Normal',
    Average = 'Average',
    Good = 'Good',
    Excellent = 'Excellent',
}

export const numbersArray = Array.from(Array(101).keys());
export const temperatureArray = Array.from({ length: 21 }, (_, index) => index - 10);

export const DeliveryOrderFormSchema = z.object({
    quantity: z.number().int().positive().min(1),
    packaging: z.enum([
        PackagingOptions.PoorRejected,
        PackagingOptions.PoorAccepted,
        PackagingOptions.OkCouldBeBetter,
        PackagingOptions.Normal,
        PackagingOptions.Average,
        PackagingOptions.Good,
        PackagingOptions.Excellent,
    ]).default(PackagingOptions.Normal),
    delivery_vehicle: z.enum([
        DeliveryVehicle.Poor,
        DeliveryVehicle.Ok,
        DeliveryVehicle.Normal,
        DeliveryVehicle.Average,
        DeliveryVehicle.Good,
        DeliveryVehicle.Excellent,
    ]).default(DeliveryVehicle.Normal),
    good_until: z.date().optional(),   
    batch_number: z.string().optional(), 
    temperature: z.number().int().optional(),
});

export type DeliveryOrderFormSchemaType = z.infer<typeof DeliveryOrderFormSchema>;

