'use client'
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/common/libs/shadcn/utils";
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreateMenuLayoutProps {
    children: React.ReactNode;
}

export default function ClientPageLayout({ children }: CreateMenuLayoutProps) {
    const pathname = usePathname()
    const params = useParams()

    const {
        restaurantClient: client
    } = useGETRestaurantDataHooks({
        query: 'CLIENTS',
        defaultParams: {
            clients: {
                byId: {
                    id: params?.id as string
                }
            }
        }
    })


    const linkStyle = (active: boolean) => `bg-foreground/5 p-2 rounded-t-lg text-sm hover:bg-foreground/10 ${active && 'border-b-2 border-b-primary'}`

    return (
        <div className='relative'>
            <div className='flex-col-container items-center hidden h-80 border-2 p-4 rounded-xl  bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:grayscale md:block' />
            <div className='relative flex flex-col items-center gap-8 bg-background p-4 rounded-xl border-2 md:absolute md:top-32 md:left-8 md:flex-row md:items-start md:shadow-lg'>
                <div className='flex flex-col items-center r-2 max-w-40'>
                    <Avatar className='h-40 w-40 relative'>
                        <AvatarImage src={''} alt={client?.name} />
                        <AvatarFallback className="hover:bg-slate-800">
                            <p className='text-2xl group-hover:hidden'>
                                {client && client?.name?.split('')[0]}
                            </p>
                        </AvatarFallback>
                    </Avatar>
                    <h1 className='capitalize text-center mt-2'>{client?.name?.toLowerCase()}</h1>
                </div>
            </div>
            <div className='flex flex-wrap items-center gap-4 mt-4 md:mt-20'>
                <Link
                    className={cn(linkStyle(pathname === `/admin/restaurant/clients/${params?.id}/bookings`))}
                    href={`/admin/restaurant/clients/${params?.id}/bookings`}
                >
                    Bookings
                </Link>
                <Link
                    className={cn(linkStyle(pathname === `/admin/restaurant/clients/${params?.id}/reviews`))}
                    href={`/admin/restaurant/clients/${params?.id}/reviews`}>
                    Reviews
                </Link>
                <Link
                    className={cn(linkStyle(pathname === `/admin/restaurant/clients/${params?.id}/tables`))}
                    href={`/admin/restaurant/clients/${params?.id}/tables`}>
                    Tables
                </Link>
            </div>
            <div className='mt-6'>
                {children}
            </div>
        </div>
    )
}