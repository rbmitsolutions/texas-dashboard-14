'use client'
import { cn } from "@/common/libs/shadcn/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PaymentsLayoutProps {
    children: React.ReactNode;
}

export default function PaymentsLayout({ children }: PaymentsLayoutProps) {
    const pathname = usePathname()

    const linkStyle = (active: boolean) => `bg-foreground/5 p-2 rounded-t-lg text-sm hover:bg-foreground/10 ${active && 'border-b-2 border-b-primary'}`

    return (
        <div>
            <div className='flex flex-wrap items-center gap-4 '>
                <Link
                    className={cn(linkStyle(pathname === '/admin/hrsystem/payments/all'))}
                    href='/admin/hrsystem/payments/all'>
                    All
                </Link>
                <Link
                    className={cn(linkStyle(pathname === '/admin/hrsystem/payments/roster'))}
                    href='/admin/hrsystem/payments/roster'>
                    Roster
                </Link>
            </div>
            <div className='mt-6'>
                {children}
            </div>
        </div>
    )
}