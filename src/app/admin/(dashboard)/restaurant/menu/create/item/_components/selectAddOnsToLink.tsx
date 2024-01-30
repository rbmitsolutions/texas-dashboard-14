import { Dispatch, SetStateAction, useState } from "react"

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Wrap from "@/components/common/wrap"

//interface 
import { IGETRestaurantDataQuery, IGETMenuAddOnsResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IMenuAddOns } from "@/common/types/restaurant/menu.interface"
import { Badge } from "@/components/ui/badge"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

interface SelectAddOnsToLinkProps {
    handleUpdateAddOnsIds: (id: string, to: 'add' | 'remove') => void
    add_ons_linked: string[]
    addOns: {
        data: IGETMenuAddOnsResponse
        setAddOns: Dispatch<SetStateAction<IGETRestaurantDataQuery>>
        GETAddOns: IGETRestaurantDataQuery
        isLoading: boolean
    }
}

export default function SelectAddOnsToLink({ addOns, add_ons_linked, handleUpdateAddOnsIds }: SelectAddOnsToLinkProps) {
    const [showLinkeds, setShowLinkeds] = useState<boolean>(false)

    const handleCheckedChange = (addOns: IMenuAddOns) => {
        if (add_ons_linked?.some(s => s === addOns?.id)) {
            handleUpdateAddOnsIds(addOns?.id, 'remove')
            return
        } else {
            handleUpdateAddOnsIds(addOns?.id, 'add')
            return
        }
    }


    const handleShowLinkeds = () => {
        if (!showLinkeds) {
            addOns.setAddOns(prev => ({
                menu_add_ons: {
                    all: {
                        ...prev?.menu_add_ons?.all,
                        in: {
                            id: add_ons_linked
                        },
                        pagination: {
                            take: 5,
                            skip:0
                        }
                    }
                }
            }))
        } else {
            addOns.setAddOns(prev => ({
                menu_add_ons: {
                    all: {
                        ...prev?.menu_add_ons?.all,
                        in: {
                            id: []
                        },
                        pagination: {
                            take: 5,
                            skip:0
                        }
                    }
                }
            }))
        }
        setShowLinkeds(prev => !prev)
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        leftIcon="ChefHat"
                        className='w-48'
                        variant='outline'
                    >
                        {add_ons_linked?.length} Prerequisite Linked</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <Wrap
                        header={{
                            title: {
                                title: 'Select',
                                icon: 'ChefHat'
                            },
                            pagination: {
                                onPageChange: (pagination) => addOns?.setAddOns(prev => ({
                                    menu_add_ons: {
                                        all: {
                                            ...prev?.menu_add_ons?.all,
                                            pagination
                                        }
                                    }
                                })),
                                pagination: addOns?.data?.pagination,
                                queryPagination: addOns?.GETAddOns?.menu_add_ons?.all?.pagination!
                            }
                        }}
                        actions={{
                            toLeft: (
                                <Button
                                    leftIcon='Link2'
                                    variant={showLinkeds ? 'default' : 'outline'}
                                    onClick={handleShowLinkeds}
                                >
                                    Linked
                                </Button>
                            ),
                            searchInput: {
                                value: addOns?.GETAddOns?.menu_add_ons?.all?.title || '',
                                onSearchChange: (title) => addOns?.setAddOns(prev => ({
                                    menu_add_ons: {
                                        all: {
                                            ...prev?.menu_add_ons?.all,
                                            title
                                        }
                                    }
                                })),
                                placeholder: 'Search by title . . .',
                            },
                            className: 'grid grid-cols-[100px,1fr] gap-2'
                        }}
                        className='mt-6'
                    >
                        <div className='flex-col-container max-h-[450px] h-[450px] overflow-auto scrollbar-thin'>
                            {addOns?.data?.data?.map(addOns => {
                                return (
                                    <FormLabel className='flex-col-center cursor-pointer bg-background-soft rounded-lg p-2' htmlFor={addOns?.id} key={addOns?.id}>
                                        <div className='flex-container-center justify-between'>
                                            <div className='flex-container-center'>
                                                <Checkbox
                                                    id={addOns?.id}
                                                    checked={add_ons_linked?.includes(addOns?.id)}
                                                    onCheckedChange={() => handleCheckedChange(addOns)}
                                                />
                                                <span>{addOns?.title}</span>
                                                <small>{addOns?.flag}</small>
                                            </div>
                                            {addOns?.is_mandatory &&
                                                <Badge className='h-4 bg-orange-600 text-sm hover:bg-orange-700'>
                                                    <small>
                                                        Mandatory
                                                    </small>
                                                </Badge>
                                            }
                                        </div>
                                        {
                                            addOns?.multiple &&
                                            <Badge className='mt-2 h-4'>
                                                <small>
                                                    Multiple / Min - {addOns?.multiple ? addOns?.min : 1} / Max - {addOns?.multiple ? addOns?.max === 999 ? 'All' : addOns?.max : '-'}
                                                </small>

                                            </Badge>
                                        }
                                        <div className='flex-container-center flex-wrap gap-1 mt-2'>
                                            {addOns?.options?.map(opt => {
                                                return (
                                                    <Badge key={opt?.id} className='bg-transparent border-foreground-2 text-foreground/60 hover:bg-transparent'>
                                                        <small>
                                                            {opt?.title} {convertCentsToEuro(opt?.value)}
                                                        </small>
                                                    </Badge>
                                                )
                                            })}
                                        </div>
                                    </FormLabel>
                                )
                            })}
                        </div>
                    </Wrap>
                </DialogContent>
            </Dialog >
        </>
    )
}