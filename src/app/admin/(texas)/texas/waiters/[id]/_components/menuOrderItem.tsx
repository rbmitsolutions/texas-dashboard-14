import { memo, useState } from "react";
import Icon from "@/common/libs/lucida-icon";

//components
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import MenuOptionsComponent from "./menuOptionsComponent";
import CreateOrder from "./createOrder";

//store
import { getFilteredOrderSystemMenu } from "@/store/texas/menu";

//hooks
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface";

interface MenuOrderItemProps {
    menu: IGETMenuOrderSystemResponse
    bg: string
    menuData: IGETMenuOrderSystemResponse[]
}

export function MenuOrderItem({ menu, bg, menuData }: MenuOrderItemProps) {
    const [menuItem, setMenuItem] = useState<IGETMenuOrderSystemResponse>(menu)
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        if(menuItem?.f_options?.length > 0) {
            setStep(1)
        }
        setIsOpen(!isOpen)
        setMenuItem(menu)
    }

    const updateMenuItem = (option: IGETMenuOrderSystemResponse) => {
        setStep(0)
        setMenuItem(option)
    }

    

    const renderContent = () => {
        switch (step) {
            case 0:
                return <CreateOrder menu={menuItem} />
            case 1: {
                const options = getFilteredOrderSystemMenu({
                    menuItems: menuData,
                    menuFilter: {
                        id: [...menuItem?.f_options?.map((item) => item?.id)],
                        sort: {
                            options_priority: true
                        }
                    }
                })
                return <MenuOptionsComponent options={options} updateMenuItem={updateMenuItem} />
            }
            default:
                return <h1>Default</h1>
        }
    }

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={handleOpen}
        >
            <AlertDialogTrigger asChild>
                <Button
                    type='button'
                    className='flex-container-center justify-center min-h-40 max-h-60 h-full rounded-xl border-2 bg-background-soft text-black dark:text-white hover:bg-background-soft'
                    // style={{
                    //     background: bg,
                    // }}
                >
                    <h1>{menuItem?.short_title}</h1>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='h-[600px] md:!min-w-[900px]'>
                <div className='mt-4'>
                    {renderContent()}
                </div>
                <AlertDialogCancel asChild>
                    <Button
                        className='absolute p-0 top-0 left-0'
                        type='button'
                        size='icon'
                        variant='ghost'
                    >
                        <Icon name='X' />
                    </Button>
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default memo(MenuOrderItem)