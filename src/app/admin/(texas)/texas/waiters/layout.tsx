'use client'
import { io } from "socket.io-client"
import { useEffect } from "react"

//libs
import { addDaysToDate, getFirstTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"

//store
import { useOrderControllerStore } from "@/store/restaurant/orderController"
import { useTablesStore } from "@/store/restaurant/tables"
import { usePrintersStore } from "@/store/restaurant/printers"
import { useSectionsStore } from "@/store/restaurant/sections"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IAllOrderControllerResponse, IGETPrintersResponse, IGETSectionResponse, IGETTablesAllResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types"
import { useParams } from "next/navigation"

interface WaitressLayoutProps {
    children: React.ReactNode
}

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function WaitressLayout({ children }: WaitressLayoutProps) {
    const { orderControllers, setOrderControllers } = useOrderControllerStore()
    const { printers, setPrinters } = usePrintersStore()
    const { sections, setSections } = useSectionsStore()
    const { setTables, tables } = useTablesStore()

    const {
        refetchRestaurantData: refetchPrinters
    } = useGETRestaurantDataHooks({
        query: 'PRINTERS',
        defaultParams: {
            printers: {
                all: {
                    pagination: {
                        take: 50,
                        skip: 0
                    }
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
            onSuccess: (data) => {
                const printers = data as IGETPrintersResponse
                setPrinters(printers?.data)

            }
        }
    })

    const {
        refetchRestaurantData: refetchTables
    } = useGETRestaurantDataHooks({
        query: 'TABLES',
        defaultParams: {
            tables: {
                all: {
                    pagination: {
                        take: 400,
                        skip: 0
                    },
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const tables = data as IGETTablesAllResponse
                setTables(tables?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        refetchRestaurantData: refetchOrdersController
    } = useGETRestaurantDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            orderController: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                    includes: {
                        orders: '1'
                    },
                    date: {
                        gte: getFirstTimeOfTheDay(new Date()),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    finished_table_id: null
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const orderControllers = data as IAllOrderControllerResponse
                setOrderControllers(orderControllers?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        refetchRestaurantData: refetchSections
    } = useGETRestaurantDataHooks({
        query: 'SECTIONS',
        defaultParams: {
            sections: {
                all: {
                    pagination: {
                        take: 200,
                        skip: 0
                    },
                    include: {
                        tables: {
                            guests: [2,4,6,8]
                        }
                    }
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const sections = data as IGETSectionResponse
                setSections(sections?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (message?.event === SocketIoEvent.TABLE) {
                refetchTables()
                refetchSections()
            }
            if (message?.event === SocketIoEvent.ORDER) {
                refetchOrdersController()
            }
        });
        () => {
            socket.off("message");
        }
    }, [refetchTables, refetchOrdersController, refetchSections]);

    useEffect(() => {
        if (tables?.length === 0) {
            refetchTables()
        }

        if (orderControllers?.length === 0) {
            refetchOrdersController()
        }

        if (printers?.length === 0) {
            refetchPrinters()
        }

        if (sections?.length === 0) {
            refetchSections()
        }

    }, [orderControllers, refetchOrdersController, refetchTables, tables, printers, refetchPrinters, sections?.length, refetchSections])


    return (
        <>
            {children}
        </>
    )
}