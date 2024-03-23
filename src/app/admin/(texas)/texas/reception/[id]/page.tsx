'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

//libs
import { getWalkInClient } from '@/common/libs/restaurant/actions/walkinClients';

//components
import { transactionsColumnsTable } from '../_components/transactionsColumnsTable';
import RightReceptionDisplay from '../_components/rightReceptionDisplay';
import { TransactionsTable } from '../_components/transactionsTable';
import LayoutFrame from '../../../_components/layoutFrame';
import IconText from '@/components/common/iconText';
import Wrap from '@/components/common/wrap';

//hooks
import { useGETCompanyDataHooks, usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from '@/hooks/company/companyDataHooks';
import { usePUTRestaurantDataHooks } from '@/hooks/restaurant/restaurantDataHooks';
import { useSocketIoHooks } from '@/hooks/useSocketIoHooks';
import { useAuthHooks } from '@/hooks/useAuthHooks';

//store
import { useOrderControllerStore } from '@/store/restaurant/orderController';
import { useMenuSectionsStore } from '@/store/restaurant/menuSections';
import { useTransactionsStore } from '@/store/company/transactions';
import { usePrintersStore } from '@/store/restaurant/printers';
import { useTablesStore } from '@/store/restaurant/tables';
import { useOrderStore } from '@/store/restaurant/order';

//interfaces
import { ITransactions, TableTransactionsType, TransactionsStatus } from '@/common/types/company/transactions.interface';
import { IOrder, IOrderController, OrderStatus } from '@/common/types/restaurant/order.interface';
import { RedirectTo } from '@/common/types/routers/endPoints.types';
import { ITable } from '@/common/types/restaurant/tables.interface';
import { SocketIoEvent } from '@/common/libs/socketIo/types';
import { addDaysToDate, getFirstTimeOfTheDay } from '@/common/libs/date-fns/dateFormat';
import { IGetAllTransactionsResponse } from '@/hooks/company/IGetCompanyDataHooks.interface';
import { transactionsTotalByFilter } from '@/common/libs/restaurant/transactions';

export interface IDataTable {
    table: ITable | undefined
    transactions: ITransactions[]
    orders: {
        unpaid: IOrder[]
    },
    orderControllers: {
        unpaid: IOrderController[]
    }
    values: {
        total: number,
        paid: number,
        remaining: number
    }
}

export default function Table({ params }: { params: { id: string } }) {
    const { getTransactionsByFilter, getTransactionsTotalByFilter, transactions } = useTransactionsStore()
    const { getOrderControllers, getTotalOfOrdersByTableId, orderControllers } = useOrderControllerStore()
    const { menuSections } = useMenuSectionsStore()
    const { getOneOrderTotal } = useOrderStore()
    const { getTableById } = useTablesStore()
    const { printers } = usePrintersStore()
    const { emit } = useSocketIoHooks()
    const { user } = useAuthHooks()
    const { push } = useRouter()
    const [dataTable, setDataTable] = useState<IDataTable>({
        table: undefined,
        transactions: [],
        orders: {
            unpaid: []
        },
        orderControllers: {
            unpaid: []
        },
        values: {
            total: 0,
            paid: 0,
            remaining: 0
        }
    })

    const remaining = getTotalOfOrdersByTableId(params.id) - getTransactionsTotalByFilter({
        payee_key: params.id,
        status: TransactionsStatus.CONFIRMED
    })

    //todo implement it
    // const {
    //     refetchCompanyData: refetchTransactions
    // } = useGETCompanyDataHooks({
    //     query: 'TRANSACTIONS',
    //     defaultParams: {
    //         transactions: {
    //             all: {
    //                 pagination: {
    //                     take: 500,
    //                     skip: 0
    //                 },
    //                 date: {
    //                     gte: getFirstTimeOfTheDay(new Date()),
    //                     lte: addDaysToDate(new Date(), 1)
    //                 },
    //                 type: {
    //                     in: [TableTransactionsType.OPEN_TABLE]
    //                 },
    //                 payee_key: params?.id
    //             }
    //         }
    //     },
    //     UseQueryOptions: {
    //         onSuccess: (data) => {
    //             const transactions = data as IGetAllTransactionsResponse
    //             setDataTable(prev => ({
    //                 ...prev,
    //                 transactions: transactions?.data,
    //                 values: {
    //                     ...prev.values,
    //                     paid: transactionsTotalByFilter({
    //                         filter: {
    //                             payee_key: params.id,
    //                             status: TransactionsStatus.CONFIRMED
    //                         },
    //                         transactions: transactions?.data || []
    //                     })
    //                 }

    //             }))
    //         },
    //     }
    // })

    const { createCompanyData: createTransaction } = usePOSTCompanyDataHooks({
        query: 'TRANSACTIONS',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: dataTable?.table?.id
                })
                //todo implement it
                // await refetchTransactions()
            }
        }
    })

    const { updateCompanyData: updateTransaction } = usePUTCompanyDataHooks({
        query: 'TRANSACTIONS',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: dataTable?.table?.id
                })
            }
        }
    })


    const { updateRestaurantData: updateTable } = usePUTRestaurantDataHooks({
        query: 'TABLES',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.TABLE,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.BOOKING,
                    message: dataTable?.table?.id
                })
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: dataTable?.table?.id
                })
                push(RedirectTo.RECEPTION)
            }
        }
    })

    const {
        updateRestaurantData: updateOrder
    } = usePUTRestaurantDataHooks({
        query: 'ORDER',
        UseMutationOptions: {
            onSuccess: async () => {
                await emit({
                    event: SocketIoEvent.ORDER,
                    message: params?.id
                })
                await emit({
                    event: SocketIoEvent.TABLE,
                    message: params?.id
                })
            }
        }
    })

    const handleCloseTable = async () => {
        let client = {
            id: dataTable?.table?.client_id,
            name: dataTable?.table?.client_name
        }

        if (!client.id && !client.name) {
            const walkIn = await getWalkInClient()

            client = {
                id: walkIn?.id,
                name: walkIn?.name
            }
        }

        await updateTable({
            table: {
                id: params.id,
                close_table: {
                    client_id: client?.id!,
                    client_name: client?.name!
                }
            }
        })
    }

    useEffect(() => {
        setDataTable({
            table: getTableById(params.id),
            transactions: getTransactionsByFilter({ payee_key: params.id }),
            orders: {
                unpaid: getOrderControllers({
                    table_id: params.id,
                    orders: {
                        status: [OrderStatus.ORDERED, OrderStatus.DELIVERED]
                    }
                })?.map(oc => {
                    return oc?.orders?.filter(o => {
                        if (o?.status === OrderStatus.ORDERED || o?.status === OrderStatus.DELIVERED) {
                            return {
                                ...o,
                                paid: Number(o?.quantity) - Number(o?.paid)
                            }
                        }
                    })
                }).flat() || []
            },
            values: {
                total: getTotalOfOrdersByTableId(params.id),
                paid: getTransactionsTotalByFilter({
                    payee_key: params.id,
                    status: TransactionsStatus.CONFIRMED
                }),
                remaining
            },
            orderControllers: {
                unpaid: getOrderControllers({
                    table_id: params.id,
                    orders: {
                        status: [OrderStatus.ORDERED, OrderStatus.DELIVERED]
                    }
                })
            }
        })
    }, [getOrderControllers, getTableById, getTotalOfOrdersByTableId, getTransactionsByFilter, getTransactionsTotalByFilter, params.id, remaining, orderControllers, transactions])

    useEffect(() => {
        const table = getTableById(params?.id)
        if (!table || !table?.is_open) {
            push(RedirectTo.RECEPTION)
        }
    }, [getTableById, params?.id, push])


    return (
        <LayoutFrame
            user={user}
            navigation={{
                defaultPrinter: printers,
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
                    <RightReceptionDisplay
                        dataTable={dataTable}
                        getOrderControllers={getOrderControllers}
                        getOneOrderTotal={getOneOrderTotal}
                        menuSections={menuSections || []}
                        createTransaction={createTransaction}
                        user={user}
                        updateOrder={updateOrder}
                        printers={printers || []}
                        closeTable={handleCloseTable}
                    />

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
                            icon='LifeBuoy'
                            text={`Table: ${dataTable?.table?.number}`}
                        />
                        <IconText
                            icon='User'
                            text={dataTable?.table?.client_name || 'Walk In'}
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
                        columns={transactionsColumnsTable({
                            updateTransaction,
                        })}
                        data={dataTable?.transactions || []}
                    />
                </Wrap>
            </div>
        </LayoutFrame>
    )
}