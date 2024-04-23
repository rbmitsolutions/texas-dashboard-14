import { StockItemUnit } from "@/common/types/restaurant/stock.interface";
import { z } from "zod";

export const CreateItemTypeFormSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters",
    }),
    category_id: z.string().min(1, {
        message: "Category is required",
    }),
    sub_category_id: z.string().min(1, {
        message: "Sub Category is required",
    }),
    min_stock: z.number().int({
        message: "Min Stock must be an integer, e.g. 100, 200, 300, ...",
    }).min(0, {
        message: "Min Stock must be at least 0",
    }),
    max_stock: z.number().int({
        message: "Min Stock must be an integer, e.g. 100, 200, 300, ...",
    }).min(0, {
        message: "Max Stock must be at least 0",
    }),
    volume: z.number().int({
        message: "Volume must be an integer, e.g. 100ml, 200g, ...",
    }).min(0, {
        message: "Min Stock must be at least 0",
    }),
    unit: z.enum([
        StockItemUnit.GR,
        StockItemUnit.ROLL,
        StockItemUnit.PIECE,
        StockItemUnit.KW,
        StockItemUnit.KG,
        StockItemUnit.ML,
        StockItemUnit.UNIT,
        StockItemUnit.WEIGHT,
        StockItemUnit.VOLUME,
    ]).default(StockItemUnit.PIECE),
});

export type CreateItemTypeFormSchemaType = z.infer<typeof CreateItemTypeFormSchema>;


