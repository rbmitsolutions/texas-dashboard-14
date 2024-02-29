import { useState } from "react"
import { icons } from "lucide-react"

//libs
import Icon from "@/common/libs/lucida-icon"

//components
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface ExtraSideBarProps {
    icon: keyof typeof icons
    extraIcon?: React.ReactNode
    title: string
    content: React.ReactNode
    side?: 'right' | 'left'
}

export default function ExtraSideBar({
    icon,
    title,
    content,
    side = 'right',
    extraIcon
}: ExtraSideBarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSideBar = () => setIsOpen(!isOpen)
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size='icon' variant='outline' className='relative h-8 w-8 xl:hidden' onClick={toggleSideBar}>
                        <Icon name={icon} size={14} />
                        {extraIcon && extraIcon}
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side={side}
                >
                    <SheetHeader>
                        <SheetTitle>{title}</SheetTitle>
                    </SheetHeader>
                    <div className="flex-col-container">
                        {content}
                    </div>
                    <SheetFooter className=''>
                        <SheetClose />
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    )
}
