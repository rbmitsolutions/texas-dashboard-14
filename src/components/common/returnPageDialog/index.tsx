'use client'
import { useRouter } from "next/navigation";

//components
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

interface ReturnPageDialogProps {
    isOpen: boolean;
    onToggleDialog: () => void;
    message: string;
}

export default function ReturnPageDialog({ isOpen, onToggleDialog, message }: ReturnPageDialogProps): JSX.Element {
    const { back } = useRouter()
    return (
        <Dialog open={isOpen} onOpenChange={onToggleDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <div className="grid gap-4 mt-4">
                    <h2 className="text-2xl font-bold text-center my-4">{message}</h2>
                    <div className='grid grid-cols-2 gap-4'>
                        <Button
                            leftIcon="ArrowLeft"
                            onClick={back}
                            className='h-20'
                            variant='green'
                        >
                            Return
                        </Button>
                        <Button
                            onClick={onToggleDialog}
                            className='h-20'
                        >
                            Stay on page
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}