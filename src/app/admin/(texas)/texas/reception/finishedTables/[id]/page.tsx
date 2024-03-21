'use client'
import { addDaysToDate, getFirstTimeOfTheDay } from "@/common/libs/date-fns/dateFormat"

//components
import { transactionsColumnsTable } from "../../_components/transactionsColumnsTable"
import FullOrderController from "../../../_components/orderSummary/fullOrderController"
import { TransactionsTable } from "../../_components/transactionsTable"
import LayoutFrame from "@/app/admin/(texas)/_components/layoutFrame"
import IconText from "@/components/common/iconText"
import Wrap from "@/components/common/wrap"

//store
import { useMenuSectionsStore } from "@/store/restaurant/menuSections"
import { usePrintersStore } from "@/store/restaurant/printers"
import { useOrderStore } from "@/store/restaurant/order"

//hooks
import { useGETRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { useGETCompanyDataHooks, usePUTCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useSocketIoHooks } from "@/hooks/useSocketIoHooks"
import { useAuthHooks } from "@/hooks/useAuthHooks"

//interface
import { TableTransactionsType } from "@/common/types/company/transactions.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { SocketIoEvent } from "@/common/libs/socketIo/types"

export default function FinishedTable({ params }: { params: { id: string } }) {
    const { menuSections } = useMenuSectionsStore()
    const { getOneOrderTotal } = useOrderStore()
    const { printers } = usePrintersStore()
    const { emit } = useSocketIoHooks()
    const { user } = useAuthHooks()

    const {
        restaurantFinishedTable: finishedTable,
        GETRestaurantDataParams: finishedTablesParams,
        setGETRestaurantDataParams: setFinishedTablesParams,
    } = useGETRestaurantDataHooks({
        query: 'FINISHED_TABLE',
        defaultParams: {
            finishedTables: {
                byId: {
                    id: params?.id,
                }
            }
        },
    })

    const {
        restaurantAllOrderController: orderControllers,
        refetchRestaurantData: refetchOrdersController,
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
                    finished_table_id: params?.id
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const {
        companyAllTransacations: transactions,
        refetchCompanyData: refetchTransactions,
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
                        in: [TableTransactionsType.CLOSED_TABLE]
                    },
                    payee_key: params?.id
                }
            }
        },
        UseQueryOptions: {
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

    const { updateCompanyData: updateTransaction } = usePUTCompanyDataHooks({
        query: 'TRANSACTIONS',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: finishedTable?.id
                })
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: finishedTable?.id
                })
            }
        }
    })

    return (
        <LayoutFrame
            user={user}
            navigation={{
                icon: {
                    icon: 'Filter',
                    title: 'Tables'
                },
                content: (
                    <div className='flex-col-container overflow-auto'>
                        <i>Some info</i>
                    </div>
                ),
                return: {
                    path: RedirectTo.RECEPTION
                }
            }}
            rightNavigation={{
                content: (
                    <div className='flex-col-container'>
                        {orderControllers?.data?.map(oc => {
                            return (
                                <FullOrderController
                                    key={oc?.id}
                                    orderController={oc}
                                    orderSumary={{
                                        order: oc?.orders,
                                        getOneOrderTotal,
                                        menuSections,
                                    }}
                                    printers={printers}
                                />
                            )
                        })}
                    </div>
                ),
                icon: {
                    title: 'Order',
                    icon: 'ShoppingCart'
                }
            }}
        >
            <div className='grid grid-rows-2 gap-4 h-full'>
                <div className='grid grid-rows-[1fr,auto] h-full'>
                    <div className='flex-col-container justify-center items-center p-4 rounded-xl w-full bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover ' />
                    <div className='p-2 space-y-2'>
                        <IconText
                            icon='User'
                            text={finishedTable?.client || 'Walk In'}
                        />
                    </div>
                </div>
                <Wrap
                    header={{
                        title: {
                            icon: 'ArrowRightLeft',
                            title: 'Transactions'
                        }
                    }}
                    className='p-4 rounded-xl bg-background-soft overflow-auto scrollbar-thin'
                >
                    <TransactionsTable
                        columns={transactionsColumnsTable({})}
                        data={transactions?.data || []}
                    />
                </Wrap>
            </div>
        </LayoutFrame>
    )
}