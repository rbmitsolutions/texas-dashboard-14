'use client'

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { cn } from "@/common/libs/shadcn/utils"

interface UserDisplayProps {
    user: {
        name: string
        profile_image: string
    }
    smallText?: string
    displayClass?: string
    titleClass?: string
}

export default function UserDisplay({ user, smallText, displayClass, titleClass }: UserDisplayProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='flex gap-2 items-center min-w-32 w-full cursor-pointer'>
                    <Avatar className={cn('h-12 w-12 cursor-pointer', displayClass)}>
                        <AvatarImage src={user?.profile_image} alt={user?.name} />
                        <AvatarFallback>
                            {user?.name?.split('')[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className={cn("capitalize break-all", titleClass)}>{user?.name?.toLocaleLowerCase()}</h4>
                        {smallText &&
                            <small>{smallText}</small>
                        }
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user?.name}</DialogTitle>
                </DialogHeader>
                <div className="flex-container justify-center w-full p-8">
                    <Avatar className='h-80 w-80'>
                        <AvatarImage src={user?.profile_image} alt={user?.name} />
                        <AvatarFallback>
                            {user?.name?.split('')[0]}
                        </AvatarFallback>
                    </Avatar>

                </div>
            </DialogContent>
        </Dialog>
    )
}