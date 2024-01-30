'use client'
import { usePathname, useRouter } from "next/navigation";

//components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import { Permissions } from "@/common/types/auth/auth.interface";
import { ThemeToggle } from "@/common/providers/theme/toggle";
import SignOut from "../../../../components/common/signOut";
import { Button } from "@/components/ui/button";
import AppSearching from "./appSearching";
import Settings from "./settings";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";
import Icon from "@/common/libs/lucida-icon";

//store
import { useSideBarStore } from "@/store/sideBar";

export function Header() {
    const router = useRouter()
    const { toggleSideBar } = useSideBarStore()
    const { user } = useAuthHooks()
    const pathname = usePathname()
    const splitPathname = pathname?.split('/')

    return (
        <header className='flex-container-center justify-between px-4 gap-2 h-20 border-b-2'>
            <div className='flex-container-center'>
                <Button size='icon' variant='outline' className='h-8 w-8 flex items-center xl:hidden' onClick={toggleSideBar}>
                    <Icon name='List' size={14} />
                </Button>
                <div className='flex flex-col ml-2'>
                    {splitPathname[splitPathname?.length - 1].length < 20 ?
                        <>
                            <span className='capitalize text-[10px]'>/{splitPathname[splitPathname?.length - 2]}/</span>
                            <span className='capitalize text-xs'>{splitPathname[splitPathname?.length - 1]}</span>
                        </>
                        :
                        <Button size='iconSm' onClick={() => router.back()}>
                            <Icon name='ChevronLeft' size={18} />
                        </Button>
                    }
                </div>
            </div>
            {isUserAuthorized(user?.permissions, [Permissions.ADMIN, Permissions.ADMIN_GHOST]) &&
                <AppSearching />
            }
            <div className='flex-container-center'>
                <Avatar className='h-9 w-9'>
                    <AvatarImage src={user?.profile_image} alt={user?.name} />
                    <AvatarFallback>
                        {user && user?.name?.split('')[0]}
                    </AvatarFallback>
                </Avatar>
                {isUserAuthorized(user?.permissions, [Permissions.ADMIN, Permissions.ADMIN_GHOST]) &&
                    <Settings />
                }
                <ThemeToggle />
                <SignOut />
            </div>
        </header>
    )
}