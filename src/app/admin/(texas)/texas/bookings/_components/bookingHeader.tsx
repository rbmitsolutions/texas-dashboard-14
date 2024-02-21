//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import IconText from "@/components/common/iconText"
import { Button } from "@/components/ui/button"

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { IGETBookingPageTimesOpenReturn } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized"
import { Permissions } from "@/common/types/auth/auth.interface"
import { cn } from "@/common/libs/shadcn/utils"

interface BookingHeaderProps {
    time: IGETBookingPageTimesOpenReturn
}

//todo close times booking
export default function BookingHeader({ time }: BookingHeaderProps) {
    const { user } = useAuthHooks()

    const alertTablesCountBg = (tabFor: 2 | 4 | 6 | 8, qtyTabAvailable: number) => {
        if (tabFor === 2 || tabFor === 4 || tabFor === 6) {
            return qtyTabAvailable > 8 ? 'text-foreground' : qtyTabAvailable <= 12 && qtyTabAvailable >= 4 ? 'text-yellow-600' : 'text-red-600'
        } else if (tabFor === 8) {
            return qtyTabAvailable > 3 ? 'text-foreground' : qtyTabAvailable <= 2 && qtyTabAvailable >= 2 ? 'text-yellow-600' : 'text-red-600'
        }

    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className='flex flex-col items-center w-full cursor-pointer '>
                    <small className='text-[10px] font-bold text-primary text-center py-1'>
                        {time?.time}
                    </small>
                    <div className='flex justify-between gap-1'>
                        <IconText
                            icon="Dice2"
                            text={time?.tables_available?.count?.[2]}
                            iconSize={10}
                            className={cn('gap-1', alertTablesCountBg(2, time?.tables_available?.count?.[2]))}
                            pclass='text-[10px]'
                        />
                        <IconText
                            icon="Dice4"
                            text={time?.tables_available?.count?.[4]}
                            iconSize={10}
                            className={cn('gap-1', alertTablesCountBg(4, time?.tables_available?.count?.[4]))}
                            pclass='text-[10px]'

                        />
                        <IconText
                            icon="Dice6"
                            text={time?.tables_available?.count?.[6]}
                            iconSize={10}
                            className={cn('gap-1', alertTablesCountBg(6, time?.tables_available?.count?.[6]))}
                            pclass='text-[10px]'

                        />
                        <IconText
                            icon="Dice6"
                            text={time?.tables_available?.count?.[8]}
                            iconSize={10}
                            className={cn('gap-1', alertTablesCountBg(8, time?.tables_available?.count?.[8]))}
                            pclass='text-[10px]'
                        />
                    </div>
                </div>
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px]"
            >
                <SheetHeader>
                    <SheetTitle>{time?.time}</SheetTitle>
                    <SheetTitle className='text-primary'>Tables Available</SheetTitle>
                </SheetHeader>
                <div className='flex-col-container overflow-auto scrollbar-thin'>
                    {[2, 4, 6, 8]?.map(g => {
                        return (
                            <div key={g} className=' bg-background-soft p-2 rounded-lg'>
                                <small className='text-primary'>For {g} Guests</small>
                                <div className='flex-container flex-wrap mt-1'>
                                    {time?.tables_available?.spare?.map(t => {
                                        if (t?.guests === g) {
                                            return (
                                                <div key={t?.id}>
                                                    <IconText
                                                        icon="Dice2"
                                                        text={t?.section?.title + ' ' + t?.number}
                                                        iconSize={16}
                                                        className='gap-1'
                                                    />
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <SheetFooter>
                    <Button
                        variant={time?.active ? 'destructive' : 'green'}
                        leftIcon={time?.active ? 'CalendarOff' : 'CalendarCheck'}
                        className='w-full h-16'
                        disabled={isUserAuthorized(
                            user,
                            [Permissions.ADMIN, Permissions.BOOKING_ADM]
                        )}
                    >
                        {time?.active ? 'Close for Bookings' : 'Open for Bookings'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}