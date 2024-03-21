'use client'
import { io } from "socket.io-client"
import { useEffect } from "react"

//libs
import { addDaysToDate, getFirstTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"

//store
import { useOrderControllerStore } from "@/store/restaurant/orderController"
import { useTablesStore } from "@/store/restaurant/tables"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IAllOrderControllerResponse, IGETMenuSectionsResponse, IGETPrintersResponse, IGETTablesAllResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types"
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { TableTransactionsType } from "@/common/types/company/transactions.interface"
import { IGetAllTransactionsResponse } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { useTransactionsStore } from "@/store/company/transactions"
import { usePrintersStore } from "@/store/restaurant/printers"
import { useMenuSectionsStore } from "@/store/restaurant/menuSections"

interface ReceptionLayoutProps {
    children: React.ReactNode
}

const socket = io(process.env.NEXT_PUBLIC_URL! as string);

export default function ReceptionLayout({ children }: ReceptionLayoutProps) {
    const { orderControllers, setOrderControllers } = useOrderControllerStore()
    const { menuSections, setMenuSections } = useMenuSectionsStore()
    const { transactions, setTransactions } = useTransactionsStore()
    const { printers, setPrinters } = usePrintersStore()
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
            onSuccess: (data) => {
                const printers = data as IGETPrintersResponse
                setPrinters(printers?.data)
            },
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
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
            refetchOnMount: false,
        }
    })

    const {
        refetchCompanyData: refetchTransactions
    } = useGETCompanyDataHooks({
        query: 'TRANSACTIONS',
        defaultParams: {
            transactions: {
                all: {
                    pagination: {
                        take: 500,
                        skip: 0
                    },
                    date: {
                        gte: getFirstTimeOfTheDay(new Date()),
                        lte: addDaysToDate(new Date(), 1)
                    },
                    type: {
                        in: [TableTransactionsType.OPEN_TABLE]
                    }
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const transactions = data as IGetAllTransactionsResponse
                setTransactions(transactions?.data)
            },
            refetchOnMount: false,
        }
    })

    const {
        refetchRestaurantData: refetchMenuSections
    } = useGETRestaurantDataHooks({
        query: 'MENU_SECTION',
        defaultParams: {
            menu_sections: {
                all: {
                    includes: {
                        types: '1'
                    },
                    pagination: {
                        take: 200,
                        skip: 0
                    }
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                const menuSections = data as IGETMenuSectionsResponse
                setMenuSections(menuSections?.data)
            },
            refetchOnMount: false,
        }
    })


    useEffect(() => {
        socket.on("message", (message: ISocketMessage) => {
            if (message?.event === SocketIoEvent.TABLE) {
                refetchTables()
            }
            if (message?.event === SocketIoEvent.ORDER) {
                refetchOrdersController()
            }
            if (message?.event === SocketIoEvent.TABLE_PAYMENT) {
                refetchTransactions()
            }
        });
        () => {
            socket.off("message");
        }
    }, [refetchTables, refetchOrdersController, refetchTransactions]);

    useEffect(() => {
        if (tables?.length === 0) {
            refetchTables()
        }

        if (orderControllers?.length === 0) {
            refetchOrdersController()
        }

        if (transactions?.length === 0) {
            refetchTransactions()
        }

        if (printers?.length === 0) {
            refetchPrinters()
        }

        if (menuSections?.length === 0) {
            refetchMenuSections()
        }
        
    }, [menuSections?.length, orderControllers?.length, printers?.length, refetchMenuSections, refetchOrdersController, refetchPrinters, refetchTables, refetchTransactions, tables?.length, transactions?.length])

    return (
        <>
            {children}
        </>
    )
}