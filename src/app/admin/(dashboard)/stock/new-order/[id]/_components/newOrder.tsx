import { useEffect, useState } from "react";

//libs
import { numbersArray } from "@/common/libs/zod/forms/stock/deliveOrderForm";

//components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IconText from "@/components/common/iconText";
import PedingOrders from "./pedingOrders";

//interfaces
import { IStockProducts, IStockSuppliers } from "@/common/types/restaurant/stock.interface"
import { INewOrder } from "../page";

interface NewOrderProps {
    order: INewOrder[]
    supplier: IStockSuppliers
    product: IStockProducts
    handleUpdateNewOrder: (newOrder: INewOrder) => void
}

export default function NewOrder({ order, supplier, product, handleUpdateNewOrder }: NewOrderProps) {
    const [value, setValue] = useState<number>(0);

    const onQuantityChange = (value: number) => {
        setValue(value);
        handleUpdateNewOrder({
            item_id: product?.item?.id,
            supplier: supplier?.title,
            product_id: product?.id,
            product_quantity: value,
            volume_quantity: (product?.pack_quantity * value) * product?.item?.volume,
            supplier_id: supplier?.id
        })
    }

    useEffect(() => {
        setValue(order?.find(o => o.product_id === product?.id)?.product_quantity || 0)
    }, [order, product?.id])

    return (
        <div className='w-full p-4 rounded-md bg-background-soft'>
            <strong>{product?.title}</strong>
            <div className='flex-col-container gap-2 items-start mt-2'>
                <div className='grid-container grid-cols-2 gap-2'>
                    <IconText
                        icon='Package'
                        text={product?.item?.title}
                    />
                    <IconText
                        icon='Boxes'
                        text={(product?.item?.stock / product?.item?.volume)}
                        pclass={product?.item?.stock < product?.item?.min_stock ? 'text-red-500' : ''}
                    />
                    <IconText
                        icon='Boxes'
                        text={'Min -' + product?.item?.min_stock}
                    />
                    <IconText
                        icon='Boxes'
                        text={'Max -' + product?.item?.max_stock}
                    />
                </div>
                {product?.item?.stock < product?.item?.min_stock &&
                    <small className='text-red-500'>
                        Stock is low
                    </small>
                }
                <Select
                    onValueChange={e => onQuantityChange(Number(e))}
                    defaultValue={String(value)}
                    value={String(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Sub Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {numbersArray?.map(q => {
                            const maxQuantityToOrder = Math.floor((product?.item?.max_stock - (product?.item?.stock / product?.item?.volume)) / product?.pack_quantity)

                            if (q > (maxQuantityToOrder + 1)) return null
                            return (
                                <SelectItem key={q} value={String(q)}>{q}</SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
                {value > 0 &&
                    <small>{(product?.pack_quantity * value) + (product?.item?.stock / product?.item?.volume)} {product?.item?.title}</small>
                }
                {
                    product?.orders?.length > 0 &&
                    <div className='flex-container w-full justify-between'>
                        <strong>Pending orders</strong>
                        <PedingOrders
                            orders={product?.orders}
                            product={product}
                        />
                    </div>
                }
            </div>
        </div>
    )
}