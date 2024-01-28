'use client'
import { cn } from "@/common/libs/shadcn/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CreateMenuLayoutProps {
    children: React.ReactNode;
}

export default function CreateMenuLayout({ children }: CreateMenuLayoutProps) {
    const pathname = usePathname()

    const linkStyle = (active: boolean) => `bg-foreground/5 p-2 rounded-t-lg text-sm hover:bg-foreground/10 ${active && 'border-b-2 border-b-primary'}`
    
    return (
        <div>
            <div className='flex flex-wrap items-center gap-4 '>
                <Link
                    className={cn(linkStyle(pathname === '/admin/restaurant/menu/create/section'))}
                    href='/admin/restaurant/menu/create/section'
                >
                    Section / Types
                </Link>
                <Link
                    className={cn(linkStyle(pathname === '/admin/restaurant/menu/create/prerequisite'))}
                    href='/admin/restaurant/menu/create/prerequisite'>
                    Prerequisite
                </Link>
                <Link
                    className={cn(linkStyle(pathname === '/admin/restaurant/menu/create/item'))}
                    href='/admin/restaurant/menu/create/item'>
                    Menu
                </Link>
            </div>
            <div className='mt-6'>
                {children}
            </div>
        </div>
    )
}