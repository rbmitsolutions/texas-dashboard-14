'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

//libs
import Icon from "@/common/libs/lucida-icon"

//components
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"
import { Button } from "@/components/ui/button"
import Wrap from "@/components/common/wrap"

//hoooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { INotification, NotificationRedirectTo, NotificationType } from "@/common/types/notifications.interface"
import { IQueryPagination } from "@/common/types/settings.interface"

export default function Notifications() {
    const [open, setOpen] = useState(false)
    const { push } = useRouter()
    const {
        serviceNotification: notifications,
        setGETCompanyDataParams: setNotificationParams,
        GETCompanyDataParams: notificationParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'NOTIFICATION',
        defaultParams: {
            notification: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        deleteCompanyData: deleteNotification,
    } = useDELETECompanyDataHooks({
        query: 'NOTIFICATION',
        toRefetch,
        showToast: false
    })

    const onOpenChange = () => {
        setOpen(!open)
    }

    const onNotificationClick = async (notification: INotification) => {
        if(notification?.type === NotificationType.CONTRACT_SIGNED) {
            push(NotificationRedirectTo[notification?.type] + `/` + notification?.key_id)
        } else {
            push(NotificationRedirectTo[notification?.type])
        }
        onOpenChange()
    }

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetTrigger asChild>
                <Button
                    size='iconSm'
                    className='relative'
                    variant={notifications?.data?.length > 0 ? 'default' : 'outline'}
                >
                    <Icon name="Bell" />
                    {notifications?.data?.length > 0 &&
                        <div className='absolute -top-2 -right-2 text-xs text-white bg-red-500 rounded-full h-5 w-5 flex items-center justify-center shadow-md'>
                            {notifications?.data?.length}
                        </div>
                    }
                </Button>
            </SheetTrigger>
            <SheetContent >
                <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <Wrap
                    className="overflow-auto scrollbar-thin"
                    header={{
                        pagination: {
                            onPageChange: (pagination: IQueryPagination) => setNotificationParams(prev => ({
                                notification: {
                                    all: {
                                        ...prev?.notification?.all,
                                        pagination
                                    }
                                }
                            })),
                            pagination: notifications?.pagination,
                            queryPagination: notificationParams?.notification?.all?.pagination!
                        }
                    }}
                >
                    <div className='flex-col-container gap-4 '>
                        {notifications?.data?.map(notification => {
                            return (
                                <div
                                    key={notification?.id}
                                    className='flex-col-container gap-1 p-2 bg-background-soft rounded-lg cursor-pointer hover:opacity-80 group'
                                >
                                    <div className='flex-container items-center justify-between'>
                                        <strong className='capitalize text-primary '>
                                            {notification?.type}
                                        </strong>
                                        <div className='flex-container items-center gap-2 invisible group-hover:visible'>
                                            <DeleteDialogButton
                                                onDelete={async () => await deleteNotification({
                                                    notification: {
                                                        id: notification?.id
                                                    }
                                                })}
                                            />
                                            <Button
                                                onClick={() => onNotificationClick(notification)}
                                                size='iconExSm'
                                            >
                                                <Icon name='ChevronRight' />
                                            </Button>
                                        </div>
                                    </div>
                                    <small className='text-justify'>
                                        {notification?.message}
                                    </small>

                                </div>
                            )
                        })}
                    </div>
                </Wrap>
                <SheetFooter className=''>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}