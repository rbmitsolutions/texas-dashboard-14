import { cn } from "@/common/libs/shadcn/utils"
import { IMenuAddOns, IMenuAddOnsOption } from "@/common/types/restaurant/menu.interface"
import { Button } from "@/components/ui/button"
import { ICreateOrder } from "."

interface IAddOnsSelect {
    addOn: IMenuAddOns
    handleAddOns: (option: IMenuAddOnsOption, isMandatory: boolean) => void
    addOnsOrder: ICreateOrder['add_ons']
}

export default function AddOnsSelect({ addOn, handleAddOns, addOnsOrder }: IAddOnsSelect) {
    return (
        <div key={addOn?.id}>
            <div className='flex justify-between'>
                <div className='flex gap-2'>
                    <small>{addOn?.title}</small>
                    {addOn?.flag &&
                        <Button
                            className='text-xs p-0 h-4 px-2 ml-2'
                        >{addOn?.flag}</Button>
                    }
                </div>
                {addOn?.is_mandatory &&
                    <Button
                        className='text-xs p-0 h-4 px-2 ml-2'
                        variant='destructive'
                    >
                        Mandatory
                    </Button>
                }
            </div>
            <div className={cn('flex items-center py-1 px-4 gap-2 w-full h-16 rounded-lg overflow-auto md:max-w-[640px]', addOn?.is_mandatory ? 'bg-foreground/10' : 'bg-foreground/5')}>
                {addOn?.options?.map(opt => {
                    return (
                        <Button
                            key={opt?.id}
                            className={cn('border-2 text-foreground bg-transparent hover:bg-transparent focus:bg-transparent', addOnsOrder?.find(a => a?.add_ons_opt_title === opt?.title && a?.add_ons_id === opt?.add_ons_id) && 'border-primary')}
                            onClick={() => handleAddOns(opt, addOn?.is_mandatory)}
                        >
                            {opt?.title}
                        </Button>
                    )
                })}

            </div>
        </div >
    )
}