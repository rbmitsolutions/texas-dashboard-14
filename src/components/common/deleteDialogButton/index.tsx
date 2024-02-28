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
import { Button, ButtonProps } from "@/components/ui/button"

interface DeleteDialogButtonProps {
    onDelete: () => void
    buttonText?: string
    isDisabled?: boolean
    children?: React.ReactNode
    buttonProps?: ButtonProps
    undo?: {
        buttonText: string
        onUndo: () => void
        description: string
    }
}

export function DeleteDialogButton({ isDisabled, onDelete, buttonText, buttonProps, undo, children }: DeleteDialogButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children ? children :
                    <Button
                        {...buttonProps}
                        variant='destructive'
                        disabled={isDisabled}
                    >
                        <Icon name='Trash2' size={14} />
                    </Button>
                }
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {undo ? undo.description : 'This action cannot be undone'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            leftIcon={undo ? 'Undo' : 'Trash'}
                            onClick={undo ? undo?.onUndo : onDelete}
                            className={undo ? '!bg-green-400' : '!bg-red-400'}
                            disabled={isDisabled}
                        >
                            {undo ? undo.buttonText : buttonText ? buttonText : 'Delete'}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
