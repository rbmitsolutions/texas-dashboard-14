import { useCallback, useEffect, useState } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//components
import SalesByMenuTypeAnalytics from "./salesByMenuTypeAnalytics"
import InfoBox from "@/components/common/infoBox"
import WrapSelect from "../wrapSelect"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { OrderStatus } from "@/common/types/restaurant/order.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"

interface SalesAnalyticsProps {
    date: {
        from: Date
        to: Date
    }
}

interface IDataOrders {
    title: string
    total: number
}

export default function SalesAnalytics({ date }: SalesAnalyticsProps) {
    const [menuSection, setMenuSection] = useState<IMenuSection | undefined>(undefined)

    const {
        restaurantOrdersAnalytics: dataOrders,
        setGETRestaurantDataParams: setOrdersParams,
    } = useGETRestaurantDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    mn_section: {
                        in: ['Starters', 'Main Course', 'Sides', 'Desserts', 'Bar']
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
        restaurantAllMenuSections: menuSections,
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    includes: {
                        types: '1'
                    },
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })


    const handleSelectMenuSection = (title: string) => () => {
        const section = menuSections?.data?.find((section: IMenuSection) => section?.title === title)
        setMenuSection(prev => prev?.title === title ? undefined : section)
    }

    const onDateChange = useCallback((date: { from: Date, to: Date }) => {
        setOrdersParams({
            order: {
                analytics: {
                    mn_section: {
                        in: ['Starters', 'Main Course', 'Sides', 'Desserts', 'Bar']
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
    }, [setOrdersParams]);

    useEffect(() => {
        onDateChange(date)
    }, [date, onDateChange])

    return (
        <div className='flex-col-container'>
            <strong>Sales</strong>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6'>
                {dataOrders?.map((data: IDataOrders) => {
                    return (
                        <WrapSelect
                            key={data?.title}
                            selected={data?.title === menuSection?.title}
                            handleSelect={handleSelectMenuSection(data?.title)}
                        >
                            <InfoBox
                                icon={{
                                    name: 'PieChart',
                                }}
                                title={data?.title}
                                value={convertCentsToEuro(data?.total || 0)}
                            />
                        </WrapSelect>
                    )
                })}
            </div>
            {menuSection &&
                <div className='flex-col-container p-4 bg-slate-100 dark:bg-slate-900'>
                    <SalesByMenuTypeAnalytics
                        date={date}
                        menuSection={menuSection}
                    />
                </div>
            }
        </div>
    )
}