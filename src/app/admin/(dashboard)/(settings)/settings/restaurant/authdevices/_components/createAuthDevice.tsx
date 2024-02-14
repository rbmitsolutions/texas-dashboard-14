import { useState } from "react"
import { UseMutateFunction } from "react-query"

//components
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

//interfaces
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"

interface CreateAuthDeviceProps {
    createAuthorizedDevice: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
}

export default function CreateAuthDevice({ createAuthorizedDevice }: CreateAuthDeviceProps): JSX.Element {
    const [description, setDescription] = useState<string>("")

    const onSubmit = async () => {
        if (!description) return

        await createAuthorizedDevice({
            authorizedDevice: {
                description
            }
        }, {
            onSuccess: () => {
                setDescription('')
            }
        })
    }

    return (
        <AlertDialog
        >
            <AlertDialogTrigger asChild>
                <Button
                    leftIcon='TabletSmartphone'
                    variant='orange'
                >
                    Add This Device
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Authorize Device</AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                    <Textarea
                        className='resize-none h-40'
                        placeholder="Enter device description - e.g. John Doe`s iphone"
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button
                            variant='outline'
                            leftIcon='X'
                        >Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            leftIcon="Save"
                            disabled={!description}
                            onClick={onSubmit}
                        >Save</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}