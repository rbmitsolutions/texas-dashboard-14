'use client'
import Icon from "@/common/libs/lucida-icon";
import { cn } from "@/common/libs/shadcn/utils";
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interfaces
import { IRoute } from "@/routes"
import { usePathname, useRouter } from "next/navigation";

interface NavBarButtonsProps {
    router: IRoute
}

const NavbarButton = ({ router }: NavBarButtonsProps) => {
    const { user } = useAuthHooks()
    const pathName = usePathname()
    const r = useRouter()
    
    if (router?.items) {
        return <NavbarButtonCollapsible router={router} />
    }

    if(isUserAuthorized(user?.permissions, router?.authorization))
    return (
        <Button
            variant='link'
            className={cn('flex gap-2 justify-start px-2 text-sm text-foreground w-full hover:text-primary', pathName === router?.layout + router?.path && 'bg-background-soft')}
            onClick={() => r.push(router?.layout + router?.path)}
        >
            {router?.icon}
            <span className='font-normal'>{router?.name}</span>
        </Button>
    )
}

const NavbarButtonCollapsible = ({ router }: NavBarButtonsProps) => {
    const pathName = usePathname()
    return (
        <Collapsible>
            <CollapsibleTrigger className={cn('w-full p-2 rounded-md hover:text-primary', 
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