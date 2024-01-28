import { IMenu, IMenuAddOns, IMenuAddOnsOption } from "@/common/types/restaurant/menu.interface"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import AddOnsSelect from "./addOnsSelect"

export interface ICreateOrder {
    add_ons: {
        is_add_ons_mandatory: boolean
        add_ons_id: string
        add_ons_opt_title: string
        add_ons_opt_value: number // price in cents
    }[]
}

interface MenuAddOnsComponentProps {
    menu: IMenu
    type_add_ons: IMenuAddOns[]
}

export default function AddOnsComponent({ menu, type_add_ons }: MenuAddOnsComponentProps) {
    const [createOrder, setCreateOrder] = useState<ICreateOrder>({
        add_ons: []
    })

    const handleAddOns = (option: IMenuAddOnsOption, isMandatory: boolean) => {
        setCreateOrder(prev => ({
            ...prev,
            add_ons: prev?.add_ons?.find(a => a?.add_ons_id === option?.add_ons_id) ? prev?.add_ons?.map(a => {
                if (a?.add_ons_id === option?.add_ons_id) {
                    return {
                        ...a,
                        add_ons_opt_title: option?.title,
                        add_ons_opt_value: option?.value
                    }
                } else {
                    return a
                }
            }) : [...prev?.add_ons, {
                is_add_ons_mandatory: isMandatory,
                add_ons_id: option?.add_ons_id,
                add_ons_opt_title: option?.title,
                add_ons_opt_value: option?.value
            }]

        }))
    }

    // const addOns = [...menu?.add_ons || [], ...type_add_ons]

    return (
        <div className='grid grid-cols-1 h-full w-full md:grid-cols-[1fr,200px]'>
            <div className=' p-2'>
                <div className='sm:flex-container-center'>
                    <h1 className='line-clamp-1 font-bold text-xl'>{menu?.title}</h1>
                    <div className='space-x-2'>
                        {menu?.allergens?.map(a => {
                            return (
                                <span key={a} className='text-xs'>• {a}</span>
                            )
                        })}
                    </div>
                </div>
                <div className='flex flex-col gap-2 max-h-[480px] overflow-auto md:max-h-[500px]'>
                    {type_add_ons?.sort((a, b) => {
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
                            handleAddOns={handleAddOns}
                            addOnsOrder={createOrder?.add_ons}
                        />
                    })}
                </div>
            </div>
            <div className='hidden flex-col md:flex'>
                <header className='bg-green-700 p-2'>
                    <h1 className='line-clamp-1'>{menu?.short_title}</h1>
                </header>
                <main className='bg-green-600 flex-col-container gap-2 h-full max-h-[450px] overflow-auto p-2'>
                    {createOrder?.add_ons?.map(a => {
                        return (
                            <div key={a?.add_ons_id}>
                                <p >• {a?.add_ons_opt_title}</p>
                                <p >{convertCentsToEuro(a?.add_ons_opt_value)}</p>
                            </div>
                        )
                    })}
                </main>
                <footer className='bg-green-900 h-fit p-2'>
                    <Button>
                        {convertCentsToEuro(0)}
                    </Button>
                </footer>
            </div>
        </div>
    )
}