import Icon from "@/common/libs/lucida-icon"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogButtonProps {
    onDelete: () => void
    isDisabled?: boolean
    children?: React.ReactNode
}

export function DeleteDialogButton({ isDisabled, onDelete, children }: DeleteDialogButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children ? children :
                    <Button
                        variant='destructive'
                        size='iconSm'
                        disabled={isDisabled}
                    >
                        <Icon name='Trash' size={14} />
                    </Button>
                }
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            leftIcon="Trash"
                            variant='destructive'
                            onClick={onDelete}
                            className='bg-red-600'
                            disabled={isDisabled}
                        >
                            Delete
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
