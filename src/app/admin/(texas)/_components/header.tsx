'use client'
//components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/common/providers/theme/toggle";
import SignOut from "@/components/common/signOut";
import { Button } from "@/components/ui/button";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";
import Icon from "@/common/libs/lucida-icon";

//store
import { useSideBarStore } from "@/store/sideBar";
import { usePathname } from "next/navigation";

export function Header() {
    const { toggleSideBar } = useSideBarStore()
    const { user } = useAuthHooks()
    const pathname = usePathname()
    const splitPathname = pathname?.split('/')

    return (
        <header className='flex-container justify-between px-4 gap-2 h-20 border-b-2'>
            <div className='flex-container-center'>
                <Button size='icon' variant='outline' className='h-8 w-8  flex items-center sm:hidden' onClick={toggleSideBar}>
                    <Icon name='List' size={14} />
                </Button>
                <div className='flex flex-col ml-2'>
                    {splitPathname[splitPathname?.length - 1].length < 20 &&
                        <>
                            <span className='capitalize text-[10px]'>/{splitPathname[splitPathname?.length - 2]}/</span>
                            <span className='capitalize text-xs'>{splitPathname[splitPathname?.length - 1]}</span>
                        </>
                    }
                </div>
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