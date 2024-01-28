'use client'
import { cn } from "@/common/libs/shadcn/utils";
import routers from "@/routes";
import { useEffect, useState } from "react";
import Image from "next/image";

//components
import { NavbarButton } from "./_components/navBarButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Icon from "@/common/libs/lucida-icon";

//store
import { useSideBarStore } from "@/store/sideBar";

export function Sidebar() {
    //todo: fetch routers from server
    const { isOpen, toggleSideBar } = useSideBarStore()
    const [preRendered, setPreRendered] = useState(false);
    useEffect(() => {
        setPreRendered(true);
    }, [])

    if (!preRendered) {
        return <Sidebar.Skeleton toggleSidebar={toggleSideBar} isOpen={isOpen} />;
    }

    return (
        <>
            <div className={cn('fixed top-0 h-screen w-full z-40 bg-[rgba(0,0,0,0.15)] duration-300 sm:hidden', isOpen ? "left-0" : 'left-[-100%]')} onClick={toggleSideBar} />
            <nav className={cn('fixed flex-col-container top-0 z-50 h-screen w-[80%] gap-10 py-8 px-4 transition-[left] bg-background duration-500 sm:sticky sm:flex-col-container sm:w-full sm:gap-10', isOpen ? "left-0" : 'left-[-100%]')}>
                <div className='flex-container-center'>
                    <Button size='icon' variant='outline' className='h-8 w-8 sm:hidden' onClick={toggleSideBar}>
                        <Icon name='List' size={14} />
                    </Button>
                    <Image src='/logo/bull-white.png' className='block invert dark:invert-0' alt='logo' width={40} height={40} />
                    <h4 className='text-xs'>Texas Steakout</h4>
                </div>
                <ScrollArea className='h-full pr-6 overflow-auto'>
                    {routers?.map(r => {
                        return <div key={r.name}>
                            <NavbarButton key={r.name} router={r} />
                            <Separator className="my-2" />
                        </div>
                    })}
                </ScrollArea>
            </nav>
        </>
    )
}

interface SidebarSkeleton {
    toggleSidebar: () => void;
    isOpen: boolean
}

Sidebar.Skeleton = function SidebarSkeleton({ toggleSidebar, isOpen }: SidebarSkeleton) {
    return (
        <nav className={cn('absolute top-0 h-screen z-20 bg-background w-[80%] p-4 border-r-2 transition-[left] duration-500 sm:sticky sm:w-52 sm:left-[-100%]', isOpen ? "left-0" : 'left-[-100%]')}>
            <Button size='icon' variant='outline' className='h-8 w-8 sm:hidden' onClick={toggleSidebar}>
                <Icon name='List' size={14} />
            </Button>
            <Skeleton className="w-full h-20 mb-8 mt-8" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
            <Skeleton className="w-full h-8 mt-4" />
        </nav>
    )
}