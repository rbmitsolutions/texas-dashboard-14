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
import { IGETRestaurantDataQuery, IGETMenuResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { IMenu, IMenuType } from "@/common/types/restaurant/menu.interface"

interface SelectMenuToLinkProps {
    handleUpdateMenuIds: (id: string, to: 'add' | 'remove') => void
    menu_ids_linked: string[]
    menu: {
        data: IGETMenuResponse
        isLoading: boolean
        setGETMenu: Dispatch<SetStateAction<IGETRestaurantDataQuery>>
        GETMenu: IGETRestaurantDataQuery
    }
    menuTypes: {
        data: IMenuType[]
        isLoading: boolean
    }
}

export default function SelectMenuToLink({ menu, menuTypes, handleUpdateMenuIds, menu_ids_linked }: SelectMenuToLinkProps) {
    const [showLinkeds, setShowLinkeds] = useState<boolean>(false)
    const [typeId, setTypeId] = useState<string>('')
    const typesOptions = menuTypes?.data?.map(type => ({
        label: type?.title,
        value: type?.id
    })) || []

    const handleCheckedChange = (m: IMenu) => {
        if (menu_ids_linked?.some(s => s === m?.id)) {
            handleUpdateMenuIds(m?.id, 'remove')
            return
        } else {
            handleUpdateMenuIds(m?.id, 'add')
            return
        }
    }

    const handleTypeChange = (mn_type_id: string) => {
        setTypeId(mn_type_id)
        const mn_type_ids = menu?.GETMenu?.menu?.all?.in?.mn_type_id || []

        if (mn_type_id === '') {
            menu?.setGETMenu(prev => ({
                menu: {
                    all: {
                        ...prev?.menu?.all,
                        in: {
                            ...prev?.menu?.all?.in,
                            mn_type_id: []
                        }
                    }
                }
            }))
            return
        }

        if (mn_type_ids?.includes(mn_type_id)) {
            menu?.setGETMenu(prev => ({
                menu: {
                    all: {
                        ...prev?.menu?.all,
                        in: {
                            ...prev?.menu?.all?.in,
                            mn_type_id: mn_type_ids?.filter(f => f !== mn_type_id)
                        }
                    }
                }
            }))
            return
        }

        menu?.setGETMenu(prev => ({
            menu: {
                all: {
                    ...prev?.menu?.all,
                    in: {
                        ...prev?.menu?.all?.in,
                        mn_type_id: [...mn_type_ids, mn_type_id]
                    }
                }
            }
        }))

    }

    const handleShowLinkeds = () => {
        if (!showLinkeds) {
            menu.setGETMenu(prev => ({
                menu: {
                    all: {
                        ...prev?.menu?.all,
                        in: {
                            id: menu_ids_linked
                        },
                    }
                }
            }))
        } else {
            menu.setGETMenu(prev => ({
                menu: {
                    all: {
                        ...prev?.menu?.all,
                        in: {
                            id: []
                        },

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
                        leftIcon="CookingPot"
                        className='w-40'
                        variant='outline'
                    >
                        {menu_ids_linked?.length} Menu Linked</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Select</DialogTitle>
                    </DialogHeader>
                    <Wrap
                        header={{
                            pagination: {
                                onPageChange: (pagination) => menu?.setGETMenu(prev => ({
                                    menu: {
                                        all: {
                                            ...prev?.menu?.all,
                                            pagination
                                        }
                                    }
                                })),
                                pagination: menu?.data?.pagination,
                                queryPagination: menu?.GETMenu?.menu?.all?.pagination!
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
                                value: menu?.GETMenu?.menu?.all?.title || '',
                                onSearchChange: (title) => menu?.setGETMenu(prev => ({
                                    menu: {
                                        all: {
                                            ...prev.menu?.all,
                                            title
                                        }
                                    }
                                })),
                                placeholder: 'Search by title . . .',
                            },
                            optionsPopover: {
                                isLoading: menuTypes?.isLoading,
                                options: [
                                    {
                                        label: 'By Type',
                                        placeholder: 'By type',
                                        value: typeId || '',
                                        onChange: (mn_type_id) => handleTypeChange(mn_type_id === 'All' ? '' : mn_type_id || ''),
                                        options: [
                                            {
                                                label: 'All',
                                                value: 'All'
                                            },
                                            ...typesOptions
                                        ]
                                    }
                                ]
                            },
                            className: 'grid grid-cols-[100px,1fr,40px] gap-2'
                        }}
                    >
                        <div className='flex-container-center justify-between mb-2'>
                            <strong>Menu</strong>
                            <strong>Priority</strong>
                        </div>
                        <div className='flex-col-container min-h-80'>
                            {menu?.data?.data?.map(m => {
                                return (
                                    <FormLabel className='flex-container-center justify-between cursor-pointer border-b-2 pb-2' htmlFor={m?.id} key={m?.id}>
                                        <div className='flex items-center gap-2'>
                                            <Checkbox
                                                id={m?.id}
                                                checked={menu_ids_linked?.includes(m?.id)}
                                                onCheckedChange={() => handleCheckedChange(m)}
                                            />
                                            <span>{m?.title}</span>
                                        </div>
                                        <span>
                                            {m?.options_priority}
                                        </span>
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