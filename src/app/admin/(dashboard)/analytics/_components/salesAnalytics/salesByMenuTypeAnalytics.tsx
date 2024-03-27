//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IMenuSection, IMenuType } from "@/common/types/restaurant/menu.interface"
import { OrderStatus } from "@/common/types/restaurant/order.interface"
import { useCallback, useEffect, useState } from "react"
import Wrap from "@/components/common/wrap"
import { cn } from "@/common/libs/shadcn/utils"
import InfoBox from "@/components/common/infoBox"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { OrdersTables } from "./ordersTable"
import { OrdersColumnsTable } from "./ordersColumns"

interface SalesByMenuTypeAnalyticsProps {
    date: {
        from: Date
        to: Date
    },
    menuSection: IMenuSection
}

interface IDataTypeOrders {
    title: string
    total: number
}
export default function SalesByMenuTypeAnalytics({ date, menuSection }: SalesByMenuTypeAnalyticsProps) {
    const [type, setType] = useState<IMenuType | undefined>(undefined)
    const {
        restaurantOrdersAnalytics: dataTypeOrders,
        setGETRestaurantDataParams: setOrdersTypeParams,
    } = useGETRestaurantDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    mn_type: {
                        in: menuSection?.types?.map(type => type?.title)
                    },
                    status: {
                        in: [OrderStatus.DELIVERED, OrderStatus.ORDERED, OrderStatus.PAID]
                    },
                    created_at: {
                        gte: new Date(date?.from),
                        lte: new Date(date?.to)
                    }
                }
            }
        }
    })

    const {
        restaurantOrdersAnalytics: orders,
        GETRestaurantDataParams: ordersParams,
        setGETRestaurantDataParams: setOrders,
    } = useGETRestaurantDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                all: {
                    mn_type: {
                        in: [type?.title!]
                    },
                    created_at: {
                        gte: new Date(date?.from),
                        lte: new Date(date?.to)
                    },
                    include: {
                        add_ons: '1'
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: !!type
        }
    })

    const handleSelectMenuType = (title: string) => {
        const type = menuSection?.types?.find(type => type?.title === title)
        setType(prev => prev?.title === title ? undefined : type)
    }

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setOrdersTypeParams({
            order: {
                analytics: {
                    mn_type: {
                        in: menuSection?.types?.map(type => type?.title)
                    },
                    status: {
                        in: [OrderStatus.DELIVERED, OrderStatus.ORDERED, OrderStatus.PAID]
                    },
                    created_at: {
                        gte: new Date(date?.from),
                        lte: new Date(date?.to)
                    }
                }
            }
        })
    }, [menuSection?.types, setOrdersTypeParams]);

    const onTypeChange = useCallback((type: IMenuType) => {
        setOrders({
            order: {
                all: {
                    mn_type: {
                        in: [type?.title!]
                    },
                    created_at: {
                        gte: new Date(date?.from),
                        lte: new Date(date?.to)
                    },
                    include: {
                        add_ons: '1'
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    },
                }
            }
        })
    }, [date, setOrders])

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    useEffect(() => {
        if (type) {
            onTypeChange(type)
        }
    }, [type, onTypeChange])

    return (
        <div className='flex-col-container gap-8'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                {dataTypeOrders?.map((data: IDataTypeOrders) => {
                    return (
                        <div
                            key={data?.title}
                            className={cn('border-2 rounded-2xl cursor-pointer', data?.title === type?.title ? 'border-primary' : 'border-transparent')}
                            onClick={() => handleSelectMenuType(data?.title)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'PieChart',
                                }}
                                title={data?.title}
                                value={convertCentsToEuro(data?.total || 0)}
                            />
                        </div>
                    )
                })}
            </div>
            <Wrap
                header={{
                    title: {
                        title: type?.title || 'Orders',
                        icon: 'ChefHat'
                    },
                    pagination: {
                        onPageChange: (pagination) => setOrders(prev => ({
                            order: {
                                all: {
                                    ...prev?.order?.all,
                                    pagination
                                }
                            }
                        })),
                        pagination: orders?.pagination,
                        queryPagination: ordersParams?.order?.all?.pagination!,
                    }
                }}
            >

                <OrdersTables
                    columns={OrdersColumnsTable({})}
                    data={orders?.data || []}
                />
            </Wrap>
        </div>
    )
}