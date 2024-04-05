import { useCallback, useEffect, useRef, useState } from "react"
import { CSVLink } from "react-csv"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"

//components
import SalesByMenuTypeAnalytics from "./salesByMenuTypeAnalytics"
import InfoBox from "@/components/common/infoBox"
import { Button } from "@/components/ui/button"
import Icon from "@/common/libs/lucida-icon"
import WrapSelect from "../wrapSelect"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//api
import { api } from "@/common/libs/axios/api"

//interface
import { OrderStatus } from "@/common/types/restaurant/order.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"

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

interface ITest {
    menu: {
        menu: string
        _sum: { quantity: number }
    }[]
    title: string
}

export default function SalesAnalytics({ date }: SalesAnalyticsProps) {
    const [menuSection, setMenuSection] = useState<IMenuSection | undefined>(undefined)
    const [csvDownload, setCsvDownload] = useState<any[]>([]);
    const csvRef = useRef(null);

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


    const downloadSalesAnalytics = async (menuSection: string) => {
        try {
            const { data } = await api.get(EndPointsTypes['RESTAURANT_ORDER_ENDPOINT'], {
                params: {
                    order: {
                        analytics: {
                            count: '1',
                            mn_section: {
                                in: [menuSection]
                            },
                            status: {
                                in: [OrderStatus.DELIVERED, OrderStatus.ORDERED, OrderStatus.PAID]
                            },
                            created_at: {
                                gte: new Date(date?.from),
                                lte: new Date(date?.to)
                            },
                        }
                    }
                }
            })

            let finalData: any[] = []

            data?.map((d: ITest) => {
                d?.menu?.map(m => {
                    finalData.push({
                        menu: m?.menu,
                        quantity: m?._sum?.quantity
                    })
                })
            })

            setCsvDownload(finalData);

            (csvRef.current as any)?.link?.click();

        } catch (err) {
            console.log('err', err)
        }
    }

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
                    <Button
                        size='iconExSm'
                        variant='orange'
                        onClick={() => downloadSalesAnalytics(menuSection?.title)}
                    >
                        <Icon
                            name='FileDown'
                        />
                    </Button>
                    <div className='none'>
                        <CSVLink
                            ref={csvRef}
                            data={csvDownload}
                            filename={`${menuSection?.title} Sales / ${formatDate({
                                date: date?.from,
                                f: 'dd/MM/yy'
                            })}`}
                        />
                    </div>
                    <SalesByMenuTypeAnalytics
                        date={date}
                        menuSection={menuSection}
                    />
                </div>
            }
        </div>
    )
}