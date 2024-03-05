//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import { Button } from "@/components/ui/button"

//interface
import { IMenuAddOns, IMenuAddOnsOption } from "@/common/types/restaurant/menu.interface"
import { IAddOnsCreateOrder, ICreateNewOrder } from "@/store/restaurant/order"
import { IHandleAddOnsSelection } from "."

interface IAddOnsSelect {
    addOn: IMenuAddOns
    handleAddOns: (data: IHandleAddOnsSelection) => void
    addOnsOrder: ICreateNewOrder['add_ons']
    handleAddFlag: (option: IAddOnsCreateOrder) => void
}

export default function AddOnsSelect({ addOn, handleAddOns, handleAddFlag, addOnsOrder }: IAddOnsSelect) {
    const handleAddOnsChange = (option: IMenuAddOnsOption) => {
        const hasOptionWithTheSameAddOnId = addOnsOrder?.filter(a => a?.add_ons_id === addOn?.id)
        const isOptionAlreadySelected = addOnsOrder?.filter(a => a?.add_ons_opt_id === option?.id)
        const isMultiple = addOn?.multiple

        if (!isMultiple) {
            if (isOptionAlreadySelected[0]?.add_ons_opt_id === option?.id) {
                handleAddOns({
                    option,
                    addOn,
                    to: 'remove'
                })
                return
            }

            if (isOptionAlreadySelected) {
                handleAddOns({
                    option,
                    addOn,
                    to: 'replace'
                })
                return
            }
            if (!isOptionAlreadySelected) {
                handleAddOns({
                    option,
                    addOn,
                    to: 'add'
                })
                return
            }
            return
        }

        if (isMultiple) {
            if (isOptionAlreadySelected[0]?.add_ons_opt_id === option?.id) {
                handleAddOns({
                    option,
                    addOn,
                    to: 'remove'
                })
                return
            }

            if (hasOptionWithTheSameAddOnId?.length >= addOn?.max) {
                return
            }

            handleAddOns({
                option,
                addOn,
                to: 'add'
            })
            return
        }
    }

    const addFlag = (addOn: IMenuAddOns, flag: string) => {
        const hasOptionWithTheSameAddOnId = addOnsOrder?.find(a => a?.add_ons_id === addOn?.id)
        if (!hasOptionWithTheSameAddOnId) return

        const hasFlag = hasOptionWithTheSameAddOnId?.title?.includes(flag)

        if (hasFlag) {
            const newTitle = hasOptionWithTheSameAddOnId?.title?.replace(`- ( ${flag} )`, '')
            handleAddFlag({
                ...hasOptionWithTheSameAddOnId,
                title: newTitle
            })
            return
        }

        const newTitle = `${hasOptionWithTheSameAddOnId?.title} - ( ${flag} )`.replace(/\s+/g, ' ');
        handleAddFlag({
            ...hasOptionWithTheSameAddOnId,
            title: newTitle
        })

    }

    return (
        <div key={addOn?.id}>
            <div className='flex justify-between items-center mb-1'>
                <div className='flex items-center gap-2 '>
                    <small>{addOn?.title}</small>
                    {addOn?.flag && !addOn?.multiple &&
                        <Button
                            className='text-xs p-0 h-6 px-2 ml-2'
                            variant={addOnsOrder?.find(a => a?.add_ons_id === addOn?.id)?.title?.includes(addOn?.flag) ? 'default' : 'outline'}
                            onClick={() => addFlag(addOn, addOn?.flag || '')}
                        >{addOn?.flag}</Button>
                    }
                </div>
                <div className='flex items-center'>
                    {addOn?.multiple &&
                        <>
                            {addOn?.min > 0 &&
                                <Button
                                    className='text-xs p-0 h-4 px-2 ml-2'
                                    variant='orange'>
                                    Min {addOn?.min}
                                </Button>

                            }
                            {addOn?.max !== 999 &&
                                <Button
                                    className='text-xs p-0 h-4 px-2 ml-2'
                                    variant='orange'>
                                    Max {addOn?.max}
                                </Button>
                            }
                        </>
                    }
                    {addOn?.is_mandatory &&
                        <Button
                            className='text-xs p-0 h-4 px-2 ml-2'
                            variant='destructive'
                        >
                            Mandatory
                        </Button>
                    }
                </div>
            </div>
            <div className={cn('flex items-center p-2 gap-2 w-full h-24 rounded-lg scrollbar-thin overflow-auto bg-foreground/5')}>
                {addOn?.options?.map(opt => {
                    return (
                        <Button
                            key={opt?.id}
                            className={cn('text-foreground h-16 min-w-28 bg-transparent hover:bg-transparent focus:bg-transparent border-2 text-wrap text-xs', addOnsOrder?.find(a => a?.add_ons_opt_id === opt?.id) && 'border-primary bg-primary/20')}
                            onClick={() => handleAddOnsChange(opt)}
                            variant='ghost'
                        >
                            {opt?.title}
                        </Button>
                    )
                })}

            </div>
        </div >
    )
}
