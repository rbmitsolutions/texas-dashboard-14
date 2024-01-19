'use client'
//components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/common/providers/theme/toggle";
import SignOut from "./sideBar/_components/signOut";
import { Button } from "@/components/ui/button";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";
import Icon from "@/common/libs/lucida-icon";

//store
import { useSideBarStore } from "@/store/sideBar";

export function Header() {
    const { toggleSideBar } = useSideBarStore()
    const { user } = useAuthHooks()

    return (
        <header className='flex-container justify-between px-4 gap-2 h-14 border-b-2'>
            <div className='flex-container-center'>
                <Button size='icon' variant='outline' className='h-8 w-8  flex items-center sm:hidden' onClick={toggleSideBar}>
                    <Icon name='List' size={14} />
                </Button>
            </div>
            <div className='flex-container-center'>
                <Avatar className='h-9 w-9'>
                    <AvatarImage src={user?.profile_image} alt={user?.name} />
                    <AvatarFallback>
                        {user && user?.name?.split('')[0]}
                    </AvatarFallback>
                </Avatar>
                <ThemeToggle />
                <SignOut />
            </div>
        </header>
    )
}