import { cn } from "@/common/libs/shadcn/utils";
import { IMenu, IMenuAddOns } from "@/common/types/restaurant/menu.interface";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { memo, useEffect, useState } from "react";
import MenuOptionsComponent from "./optionsComponent";
import Icon from "@/common/libs/lucida-icon";
import AddOnsComponent from "./addOnsComponent";

interface MenuOrderItemProps {
    menu: IMenu
    bg: string
}


export function MenuOrderItem({ menu, bg }: MenuOrderItemProps) {
    const [menuItem, setMenuItem] = useState<IMenu>(menu)
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    console.log(menu)
    const handleOpen = () => {
        setIsOpen(!isOpen)
        setMenuItem(menu)
    }

    const updateMenuItem = (menu: IMenu) => {
        setMenuItem(menu)
    }

    const renderContent = () => {
        switch (step) {
            case 0:
                return <AddOnsComponent menu={menuItem} type_add_ons={menu?.add_ons}/>
                case 1: {
                return <MenuOptionsComponent options={menuItem?.f_options} updateMenuItem={updateMenuItem} />
            }
            default:
                return <h1>Default</h1>
        }
    }

    useEffect(() => {
        if (menuItem?.f_options?.length > 0) {
            setStep(1)
        } else {
            setStep(0)
        }
    }, [menuItem])
    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={handleOpen}
        >
            <AlertDialogTrigger asChild>
                <Button
                    type='button'
                    className={cn('flex-container-center justify-center min-h-40 max-h-60 h-full rounded-xl border-2 hover:bg-transparent', bg)}
                >
                    <h1>{menuItem?.short_title}</h1>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='h-[600px] md:!min-w-[900px]'>
                <div className='flex justify-center items-center mt-4'>
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