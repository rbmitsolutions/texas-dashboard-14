'use client'
import { usePathname, useRouter } from "next/navigation";

//libs
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import { cn } from "@/common/libs/shadcn/utils";
import Icon from "@/common/libs/lucida-icon";

///components
import { Button } from "@/components/ui/button";

//store
import { useSideBarStore } from "@/store/sideBar";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interfaces
import { IToken, Permissions } from "@/common/types/auth/auth.interface";
import { IRoute } from "@/routes"

interface NavBarButtonsProps {
    router: IRoute
}

const NavbarButton = ({ router }: NavBarButtonsProps) => {
    const { toggleSideBar } = useSideBarStore()
    const { user } = useAuthHooks()
    const pathName = usePathname()
    const r = useRouter()

    if (router?.items) {
        return <NavbarButtonCollapsible router={router} user={user} />
    }

    if (router?.auth_device) {
        if (isUserAuthorized(user, router?.authorization) && (user?.authorized_device || isUserAuthorized(user, [Permissions.ADMIN, Permissions.ADMIN_GHOST]))) {
            return (
                <Button
                    variant='link'
                    className={cn('flex gap-2 justify-start px-2 text-sm text-foreground w-full h-10 hover:text-primary', pathName === router?.layout + router?.path && 'bg-background-soft')}
                    onClick={() => {
                        r.push(router?.layout + router?.path)
                        toggleSideBar()
                    }}
                >
                    {router?.icon}
                    <span className='font-normal'>{router?.name}</span>
                </Button>
            )
        } else {
            return null
        }
    }

    if (isUserAuthorized(user, router?.authorization)) {
        return (
            <Button
                variant='link'
                className={cn('flex gap-2 justify-start px-2 text-sm text-foreground w-full h-10 hover:text-primary', pathName === router?.layout + router?.path && 'bg-background-soft')}
                onClick={() => {
                    r.push(router?.layout + router?.path)
                    toggleSideBar()
                }}
            >
                {router?.icon}
                <span className='font-normal'>{router?.name}</span>
            </Button>
        )
    }
}

interface NavbarButtonCollapsibleProps {
    router: IRoute
    user: IToken
}

const NavbarButtonCollapsible = ({ router, user }: NavbarButtonCollapsibleProps) => {
    const pathName = usePathname()

    if (router?.auth_device) {
        if (isUserAuthorized(user, router?.authorization) && (user?.authorized_device || isUserAuthorized(user, [Permissions.ADMIN, Permissions.ADMIN_GHOST]))) {
            return (
                <Collapsible>
                    <CollapsibleTrigger className={cn('w-full p-2 rounded-md h-10 hover:text-primary',
                        pathName?.includes(router?.path) && 'bg-background-soft'
                    )}>
                        <div className='flex justify-between items-center gap-2 text-sm'>
                            <div className='flex gap-2 items-center text-sm '>
                                {router?.icon}
                                <span className='font-normal'>{router?.name}</span>
                            </div>
                            <Icon name='ChevronDown' size={14} />
                        </div></CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex flex-col gap-2 mt-2 ml-2'>
                            {router?.items?.map(r => <NavbarButton key={r.name} router={r} />)}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )
        } else {
            return null
        }
    }


    if (isUserAuthorized(user, router?.authorization))
        return (
            <Collapsible>
                <CollapsibleTrigger className={cn('w-full p-2 rounded-md h-10 hover:text-primary',
                    pathName?.includes(router?.path) && 'bg-background-soft'
                )}>
                    <div className='flex justify-between items-center gap-2 text-sm'>
                        <div className='flex gap-2 items-center text-sm '>
                            {router?.icon}
                            <span className='font-normal'>{router?.name}</span>
                        </div>
                        <Icon name='ChevronDown' size={14} />
                    </div></CollapsibleTrigger>
                <CollapsibleContent>
                    <div className='flex flex-col gap-2 mt-2 ml-2'>
                        {router?.items?.map(r => <NavbarButton key={r.name} router={r} />)}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        )
}

export { NavbarButtonCollapsible, NavbarButton }