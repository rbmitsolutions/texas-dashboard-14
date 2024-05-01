import { useParams } from "next/navigation";
import { useState } from "react";

//libs
import { cn } from "@/common/libs/shadcn/utils";

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SearchInput from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";

//hooks
import { useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

//interfaces
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TransferMenuImagesProps {
}

export default function TransferMenuImages({ }: TransferMenuImagesProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { id } = useParams<{ id: string }>()
    const [menuIdSelected, setMenuIdSelected] = useState<string | null>(null)

    const {
        restaurantAllMenu: menu,
        setGETRestaurantDataParams: setMenu,
        GETRestaurantDataParams: menuParams,
    } = useGETRestaurantDataHooks({
        query: 'MENU',
        defaultParams: {
            menu: {
                all: {
                    pagination: {
                        take: 200,
                        skip: 0
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: (isOpen && id) ? true : false
        }
    })

    const {
        updateRestaurantData: updateMenu,
        isUpdateRestaurantDataLoading: isUpdateMenuLoading,
    } = usePUTRestaurantDataHooks({
        query: 'MENU',
    })

    const onOpenChange = () => {
        setIsOpen(!isOpen)
        setMenuIdSelected(null)
    }

    const onTransferImages = async () => {
        if (!menuIdSelected) return

        await updateMenu({
            menu: {
                transferImages: {
                    from_id: id,
                    to_id: menuIdSelected
                }
            }
        }, {
            onSuccess: () => {
                onOpenChange()
                window.location.reload()
            }
        })
    }

    if (!id) return null

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>

                <Button
                    leftIcon="RefreshCcw"
                    size='sm'
                    variant='orange'
                >
                    Transfer Images
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Transfer Images</DialogTitle>
                </DialogHeader>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "justify-between w-full",
                                    !menuIdSelected && "text-muted-foreground"
                                )}
                            >
                                {menuIdSelected
                                    ? menu?.data?.find(
                                        (item) => item?.id === menuIdSelected
                                    )?.title
                                    : "Select Menu"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-2">
                            <div className='p-2'>
                                <SearchInput
                                    onSearchChange={(e) => {
                                        setMenuIdSelected(null)
                                        setMenu(prev => ({
                                            menu: {
                                                all: {
                                                    ...prev?.menu?.all,
                                                    title: e
                                                }
                                            }
                                        }))
                                    }}
                                    value={menuParams?.menu?.all?.title || ''}
                                />
                                <div className='h-40 overflow-auto mt-2'>
                                    {menu?.data?.map(menu => {
                                        return (
                                            <Button
                                                key={menu?.id}
                                                className='bg-background-soft p-1 line-clamp-1 cursor-pointer hover:opacity-50 border-2 rounded-sm w-full mt-1'
                                                variant={menuIdSelected === menu?.id ? 'orange' : 'outline'}
                                                disabled={menu?.id === id}
                                                onClick={() => {
                                                    setMenuIdSelected(menu?.id)
                                                }}
                                            >
                                                <small>
                                                    {menu?.title}
                                                </small>
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <div className='flex justify-end'>
                        <Button
                            leftIcon='RefreshCcw'
                            className='mt-4'
                            disabled={!menuIdSelected || isUpdateMenuLoading}
                            onClick={() => onTransferImages()}
                            isLoading={isUpdateMenuLoading}
                        >
                            Transfer
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}