import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import OrderDisplayFooter from "./footer";
import { ICreateNewOrder } from "..";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";

interface OrderDisplayProps {
    menu: IGETMenuOrderSystemResponse
    order: ICreateNewOrder
}

export default function OrderDisplay({ menu, order }: OrderDisplayProps) {
    return (
        <div className='hidden flex-col rounded-lg bg-background-soft p-2 md:flex'>
            <div className='pb-2 border-b-2 h-20'>
                <h1 className='line-clamp-1 font-bold text-xl text-primary'>{menu?.short_title}</h1>
                <div className='flex flex-wrap line-clamp-1'>
                    {menu?.allergens?.map((allergen) => {
                        return (
                            <small key={allergen} className='mr-1 text-xs text-red-500'>• {allergen}</small>
                        )})
                    }
                </div>
            </div>
            <main className='flex-col-container gap-2 h-full max-h-[390px] scrollbar-thin overflow-auto p-2'>
                {order?.add_ons?.sort((a, b) => {
                    if (a.is_mandatory && !b.is_mandatory) {
                        return -1;
                    } else if (!a.is_mandatory && b.is_mandatory) {
                        return 1;
                    } else {
                        return 0
                    }
                }).map(a => {
                    return (
                        <div key={a?.add_ons_opt_id} className='flex flex-col bg-background-soft p-2 rounded-lg'>
                            <small >- {a?.title}</small>
                            {a?.value > 0 && <small className='text-red-500'>+{convertCentsToEuro(a?.value)}</small>}
                        </div>
                    )
                })}
            </main>
            <OrderDisplayFooter order={order} />
        </div>
    )
}