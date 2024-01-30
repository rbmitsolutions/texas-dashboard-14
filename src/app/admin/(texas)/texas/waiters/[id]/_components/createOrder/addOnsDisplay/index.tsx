import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import AddOnsSelect from "./addOnsSelect";
import { ICreateNewOrder, IHandleAddOnsSelection } from "..";
import OrderDisplayFooter from "../orderDisplay/footer";

export interface IAddOnsCreateOrder {
    add_ons_id: string
    add_ons_opt_id: string
    title: string
    value: number
    is_mandatory: boolean

}

interface AddOnsDisplayProps {
    menu: IGETMenuOrderSystemResponse
    order: ICreateNewOrder
    handleSetAddOns: (addOns: IAddOnsCreateOrder[]) => void
}

export default function AddOnsDisplay({ menu, order, handleSetAddOns }: AddOnsDisplayProps) {

    const handleAddOnsSelection = ({ option, addOn, to }: IHandleAddOnsSelection) => {
        let addOns = order?.add_ons

        if (to === 'add') {
            addOns = [
                ...addOns,
                {
                    add_ons_id: addOn?.id,
                    add_ons_opt_id: option?.id,
                    title: option?.title,
                    value: option?.value,
                    is_mandatory: addOn?.is_mandatory
                }
            ]
        }

        if (to === 'remove') {
            addOns = [
                ...addOns.filter(a => a?.add_ons_opt_id !== option?.id)
            ]
        }

        if (to === 'replace') {
            addOns = [
                ...addOns.filter(a => a?.add_ons_id !== addOn?.id),
                {
                    add_ons_id: addOn?.id,
                    add_ons_opt_id: option?.id,
                    title: option?.title,
                    value: option?.value,
                    is_mandatory: addOn?.is_mandatory
                }
            ]
        }

        handleSetAddOns(addOns)
    }

    const handleAddFlag = (option: IAddOnsCreateOrder) => {
        let addOns = order?.add_ons

        addOns = [
            ...addOns.filter(a => a?.add_ons_id !== option?.add_ons_id),
            option
        ]

        handleSetAddOns(addOns)
    }

    return (
        <div className='flex-col-container p-2'>
            <div className='flex-col-container w-full max-h-[460px] overflow-auto md:max-h-[520px] md:max-w-[600px]'>
                <h1 className='font-bold text-xl text-primary scrollbar-thin md:hidden'>{menu?.short_title}</h1>
                {menu?.add_ons?.sort((a, b) => {
                    if (a.is_mandatory && !b.is_mandatory) {
                        return -1;
                    } else if (!a.is_mandatory && b.is_mandatory) {
                        return 1;
                    } else {
                        return 0
                    }
                }).map(addOn => {
                    return <AddOnsSelect
                        key={addOn?.id}
                        addOn={addOn}
                        handleAddOns={handleAddOnsSelection}
                        handleAddFlag={handleAddFlag}
                        addOnsOrder={order?.add_ons}
                    />
                })}
            </div>
            <div className='md:hidden'>
                <OrderDisplayFooter order={order} />
            </div>
        </div>
    )
}