import { useCallback, useEffect, useState } from "react"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { api } from "@/common/libs/axios/api"

//components
import { OrdersColumnsTable } from "../../../../../../components/common/basicTable/columns/restaurant/ordersColumns"
import ExcelDownloadButton from "@/components/common/excelDownloadButton"
import { OrderStatus } from "@/common/types/restaurant/order.interface"
import { BasicTable } from "@/components/common/basicTable"
import InfoBox from "@/components/common/infoBox"
import Wrap from "@/components/common/wrap"
import WrapSelect from "../wrapSelect"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IMenuSection, IMenuType } from "@/common/types/restaurant/menu.interface"
import { EndPointsTypes } from "@/common/types/routers/endPoints.types"

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

interface IDataByMenuAndType {
    title: string
    total: number
}

interface IOrdersAnalytics {
    menu: {
        menu: string
        _sum: { quantity: number }
        price: number
    }[]
    title: string
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
        restaurantOrdersAnalytics: byMenuAndType,
        setGETRestaurantDataParams: setByMenuAndTypeParams,
    } = useGETRestaurantDataHooks({
        query: 'ORDER',
        defaultParams: {
            order: {
                analytics: {
                    byMenu: {
                        in: {
                            mn_type: [type?.title!]
                        }
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
        },
        UseQueryOptions: {
            enabled: !!type
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
                    orderBy: {
                        key: 'created_at',
                        order: 'desc'
                    }
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

    const downloadSalesAnalytics = async (menuSection: string): Promise<any[] | undefined> => {
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

            data?.map((d: IOrdersAnalytics) => {
                d?.menu?.map(m => {
                    finalData.push({
                        menu: m?.menu,
                        quantity: m?._sum?.quantity,
                        total: (m?.price * m?._sum?.quantity) / 100
                    })
                })
            })
            return finalData as any[]
        } catch (err) {
            console.log('err', err)
        }
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
        if (type) {
            setByMenuAndTypeParams({
                order: {
                    analytics: {
                        byMenu: {
                            in: {
                                mn_type: [type?.title!]
                            }
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
            })
        }
    }, [setOrdersTypeParams, menuSection?.types, type, setByMenuAndTypeParams]);

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
                    orderBy: {
                        key: 'created_at',
                        order: 'desc'
                    }
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

    const byMenuAndTypeSort = byMenuAndType?.sort((a: IDataByMenuAndType, b: IDataByMenuAndType) => b?.total - a?.total) || []
    return (
        <div className='flex-col-container gap-8'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                {dataTypeOrders?.map((data: IDataTypeOrders) => {
                    return (
                        <WrapSelect
                            key={data?.title}
                            selected={data?.title === type?.title}
                            handleSelect={() => handleSelectMenuType(data?.title)}
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
            {type &&
                <div className='grid grid-cols-1 gap-4 p-4  bg-slate-200 dark:bg-slate-800 sm:grid-cols-2 xl:grid-cols-6'>
                    {byMenuAndTypeSort?.map((data: IDataByMenuAndType) => {
                        return (
                            <InfoBox
                                key={data?.title + data?.total}
                                icon={{
                                    name: 'ChefHat',
                                }}
                                title={data?.title}
                                value={convertCentsToEuro(data?.total || 0)}
                            />
                        )
                    })}
                </div>
            }
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
                actions={{
                    searchInput: {
                        onSearchChange: (search) => setOrders(prev => ({
                            order: {
                                all: {
                                    ...prev?.order?.all,
                                    menu: search,
                                    pagination: {
                                        take: 20,
                                        skip: 0
                                    },
                                }
                            }
                        })),
                        value: ordersParams?.order?.all?.menu || '',
                        placeholder: 'Search by Valid By'
                    },
                    optionsPopover: {
                        options: [
                            {
                                label: 'Sort by',
                                value: `${ordersParams?.order?.all?.orderBy?.key}/${ordersParams?.order?.all?.orderBy?.order}` || 'created_at/desc',
                                placeholder: 'Sort by',
                                onChange: (e: string) => setOrders(prev => ({
                                    order: {
                                        all: {
                                            ...prev?.order?.all,
                                            pagination: {
                                                take: 20,
                                                skip: 0
                                            },
                                            orderBy: {
                                                key: e.split('/')[0] as any,
                                                order: e.split('/')[1] as any
                                            }
                                        }
                                    }
                                })),
                                options: [
                                    {
                                        label: 'Date / Time A-Z',
                                        value: 'created_at/asc'
                                    },
                                    {
                                        label: 'Date / Time Z-A',
                                        value: 'created_at/desc'
                                    },
                                    {
                                        label: 'Quantity A-Z',
                                        value: 'quantity/asc'
                                    },
                                    {
                                        label: 'Quantity Z-A',
                                        value: 'quantity/desc'
                                    },
                                    {
                                        label: 'Title A-Z',
                                        value: 'menu/asc'
                                    },
                                    {
                                        label: 'Title Z-A',
                                        value: 'menu/desc'
                                    },
                                    {
                                        label: 'Short Title A-Z',
                                        value: 'menu_short_title/asc'
                                    },
                                    {
                                        label: 'Short Title Z-A',
                                        value: 'menu_short_title/desc'
                                    },
                                    {
                                        label: 'Price A-Z',
                                        value: 'price/asc'
                                    },
                                    {
                                        label: 'Price Z-A',
                                        value: 'price/desc'
                                    },

                                ]
                            }
                        ]
                    },
                    toRight: <>
                        <ExcelDownloadButton
                            fileName={`${menuSection?.title} - sales`}
                            onDownload={() => downloadSalesAnalytics(menuSection?.title)}
                        />
                    </>,
                    className: 'grid grid-cols-[1fr,auto,auto] items-center gap-2'
                }}
            >

                <BasicTable
                    columns={OrdersColumnsTable({})}
                    data={orders?.data || []}
                />
            </Wrap>
        </div>
    )
}