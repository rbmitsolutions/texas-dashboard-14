//components
import { IMenuAddOns, IMenuAddOnsOption, IMenuSection } from "@/common/types/restaurant/menu.interface";
import OrderDisplayFooter from "../orderDisplay/footer";
import AddOnsSelect from "./addOnsSelect";

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";
import { IAddOnsCreateOrder, ICreateNewOrder } from "@/store/restaurant/order";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export interface IHandleAddOnsSelection {
    option: IMenuAddOnsOption
    addOn: IMenuAddOns
    to: 'add' | 'remove' | 'replace'
}

interface AddOnsDisplayProps {
    menu: IGETMenuOrderSystemResponse
    order: ICreateNewOrder
    handleSetAddOns: (addOns: IAddOnsCreateOrder[]) => void
    handleChangeQuantity: (increase: boolean) => void
    setOrder: (order: ICreateNewOrder) => void
    getOneOrderTotal: (order: ICreateNewOrder) => number
    menuSections: IMenuSection[]
    updateMnSection: (mn_section: string) => void
}

export default function AddOnsDisplay({ menu, order, getOneOrderTotal, setOrder, handleSetAddOns, handleChangeQuantity, menuSections, updateMnSection }: AddOnsDisplayProps) {
    const sortedAddOns = menu?.add_ons?.sort((a, b) => {
        if (a.is_mandatory && !b.is_mandatory) {
            return -1;
        } else if (!a.is_mandatory && b.is_mandatory) {
            return 1;
        } else {
            return 0
        }
    })?.sort((a, b) => {
        return a.title.localeCompare(b.title)
    })

    const handleAddOnsSelection = ({ option, addOn, to }: IHandleAddOnsSelection) => {
        let addOns = order?.add_ons

        if (to === 'add') {
            addOns = [
                ...addOns,
                {
                    add_ons_id: addOn?.id,
                    add_ons_opt_id: option?.id,
                    title: option?.title,
                    price: option?.value,
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
                    price: option?.value,
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

    const handleAddDescription = (title: string) => {
        handleAddFlag({
            add_ons_id: 'description',
            add_ons_opt_id: 'description',
            title,
            price: 0,
            is_mandatory: false
        })

    }

    return (
        <div className='flex-col-container p-2'>
            <div className='flex-col-container w-full max-h-[460px] overflow-auto scrollbar-thin pr-2 md:max-h-[520px] md:max-w-[600px]'>
                <h1 className='font-bold text-xl text-primary scrollbar-thin md:hidden'>{menu?.short_title}</h1>
                {sortedAddOns?.map(addOn => {
                    return <AddOnsSelect
                        key={addOn?.id}
                        addOn={addOn}
                        handleAddOns={handleAddOnsSelection}
                        handleAddFlag={handleAddFlag}
                        addOnsOrder={order?.add_ons}
                    />
                })}
                <div className='flex-col-container'>
                    <Textarea
                        placeholder="Add any additional notes to this order"
                        className='h-32 resize-none scrollbar-thin'
                        value={order?.add_ons?.find(a => a?.add_ons_id === 'description')?.title || ''}
                        onChange={(e) => handleAddDescription(e.target.value)}
                    />
                </div>
                <div>
                    <div className='flex items-center gap-2 '>
                        <small>Menu Section</small>
                    </div>
                    <div className='flex p-2 gap-2 w-full min-h-24 rounded-lg scrollbar-thin overflow-auto bg-foreground/5'>
                        {menuSections?.map(opt => {
                            return (
                                <Button
                                    key={opt?.id}
                                    className='text-foreground h-16 min-w-28 bg-transparent hover:bg-transparent focus:bg-transparent border-2 text-wrap text-xs'
                                    variant={order?.mn_section === opt?.title ? 'default' : 'outline'}
                                    onClick={() => updateMnSection(opt?.title)}
                                >
                                    {opt?.title}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='md:hidden'>
                <OrderDisplayFooter
                    order={order}
                    handleChangeQuantity={handleChangeQuantity}
                    menu={menu}
                    setOrder={setOrder}
                    getOneOrderTotal={getOneOrderTotal}
                />
            </div>
        </div>
    )
}