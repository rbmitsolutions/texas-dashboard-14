//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import Icon from "@/common/libs/lucida-icon";

//components
import { Button } from "@/components/ui/button";
import OrderDisplayFooter from "./footer";

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IMenuSection } from "@/common/types/restaurant/menu.interface";
import { ICreateNewOrder } from "@/store/restaurant/order";

interface OrderDisplayProps {
    menu: IGETMenuOrderSystemResponse
    order: ICreateNewOrder
    handleRemoveAddOns: (add_ons_id: string) => void
    handleChangeQuantity: (increase: boolean) => void
    setOrder: (order: ICreateNewOrder) => void
}

export default function OrderDisplay({ menu, order, handleRemoveAddOns, handleChangeQuantity, setOrder }: OrderDisplayProps) {
    const sortedAddOns = order?.add_ons?.sort((a, b) => {
        if (a.is_mandatory && !b.is_mandatory) {
            return -1;
        } else if (!a.is_mandatory && b.is_mandatory) {
            return 1;
        } else {
            return 0
        }
    })
    return (
        <div className='hidden flex-col justify-between rounded-lg bg-background-soft p-2 md:flex'>
            <div className='pb-2 border-b-2 h-24'>
                <h1 className='line-clamp-1 font-bold text-xl text-primary'>{menu?.short_title}</h1>
                <div className='flex flex-wrap line-clamp-1'>
                    {menu?.allergens?.map((allergen) => {
                        return (
                            <small key={allergen} className='mr-1 text-xs text-red-500'>- {allergen}</small>
                        )
                    })
                    }
                </div>
            </div>
            <main className='flex-col-container gap-2 h-full max-h-[380px] scrollbar-thin overflow-auto p-2'>
                {order?.add_ons?.length === 0 && <small className='text-center text-foreground/50'>No description</small>}
                {sortedAddOns?.map(a => {
                    return (
                        <div key={a?.add_ons_opt_id} className='flex flex-col bg-background-soft p-2 rounded-lg'>
                            <div className='flex justify-between items-start'>
                                <small className='text-justify'>- {a?.title}</small>
                                <Button
                                    onClick={() => handleRemoveAddOns(a?.add_ons_opt_id)}
                                    size='iconExSm'
                                    variant='destructive'
                                    className="ml-2"
                                >
                                    <Icon name='Trash' />
                                </Button>
                            </div>
                            {a?.price > 0 && <small className='text-red-500'>+{convertCentsToEuro(a?.price)}</small>}
                        </div>
                    )
                })}
            </main>
            <OrderDisplayFooter
                order={order}
                handleChangeQuantity={handleChangeQuantity}
                menu={menu}
                setOrder={setOrder}
            />
        </div>
    )
}