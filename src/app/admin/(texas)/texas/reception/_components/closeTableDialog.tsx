'use client'
import { useRouter } from "next/navigation"

import Icon from "@/common/libs/lucida-icon"
//components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

//interface
import { RedirectTo } from "@/common/types/routers/endPoints.types"

interface CloseTableDialogProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onClose: () => void
}

export function CloseTableDialog({ isOpen, setIsOpen, onClose }: CloseTableDialogProps) {
    const { push } = useRouter()
    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={() => setIsOpen(!isOpen)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <Button
                            size='icon'
                            variant='green'
                            className='mr-4'
                            onClick={() =>  push(RedirectTo.RECEPTION)}
                        >
                            <Icon name='ChevronLeft' size={14} />
                        </Button>
                        Close Table
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        The table has paid all orders and is ready to be closed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter
                >

                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            leftIcon='XCircle'
                            className='!bg-red-500 text-white dark:!bg-red-300'
                            onClick={onClose}
                        >
                            Close Table
                        </Button>
                    </AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
