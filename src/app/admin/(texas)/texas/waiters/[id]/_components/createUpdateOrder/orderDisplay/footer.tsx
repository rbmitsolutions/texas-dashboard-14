import toast from "react-hot-toast";

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import Icon from "@/common/libs/lucida-icon";

//components
import { Button } from "@/components/ui/button";

//store
import { ICreateNewOrder } from "@/store/restaurant/order";

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";

interface OrderDisplayFooterProps {
    order: ICreateNewOrder
    handleChangeQuantity: (increase: boolean) => void
    menu: IGETMenuOrderSystemResponse
    setOrder: (order: ICreateNewOrder) => void
    getOneOrderTotal: (order: ICreateNewOrder) => number
}
export default function OrderDisplayFooter({ order, handleChangeQuantity, menu, setOrder, getOneOrderTotal }: OrderDisplayFooterProps) {

    const handleAddToOrder = () => {
        const mandatoryAddOns = menu?.add_ons.filter(a => a.is_mandatory)
        const addOnsWithMinValue = menu?.add_ons.filter(a => a.multiple && a.min > 0)

        if (addOnsWithMinValue.length > 0) {
            for (const addOn of addOnsWithMinValue) {
                if (order?.add_ons?.filter(a => a.add_ons_id === addOn?.id).length < addOn?.min) {
                    return toast.error(`${addOn?.title} needs to have at least ${addOn?.min} selected`)
                }
            }
        }


        if (mandatoryAddOns.length > 0) {
            for (const addOn of mandatoryAddOns) {
                if (order?.add_ons?.filter(a => a.add_ons_id === addOn?.id).length === 0) {
                    return toast.error(`${addOn?.title} is mandatory`)
                }
            }
        }

        setOrder(order)
    }

    return (
        <footer className='flex justify-between gap-4 border-t-2 h-fit p-2'>
            <div className='flex items-center'>
                <Button
                    size='iconSm'
                    disabled={order?.quantity === 1}
                    onClick={() => handleChangeQuantity(false)}
                >
                    <Icon name='Minus' size={14} />
                </Button>
                <span className='text-center w-8'>{order?.quantity}</span>
                <Button
                    size='iconSm'
                    onClick={() => handleChangeQuantity(true)}
                >
                    <Icon name='Plus' size={14} />
                </Button>
            </div>
            <Button
                className='text-xs w-full'
                onClick={handleAddToOrder}
                variant='green'
            >
                {convertCentsToEuro(getOneOrderTotal ? getOneOrderTotal(order) : 0)}
            </Button>
        </footer>
    )
}