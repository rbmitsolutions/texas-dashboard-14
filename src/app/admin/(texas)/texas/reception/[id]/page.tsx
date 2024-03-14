'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

//libs
import { getWalkInClient } from '@/common/libs/restaurant/actions/walkinClients';

//components
import { transactionsColumnsTable } from '../_components/transactionsColumnsTable';
import RightReceptionDisplay from '../_components/rightReceptionDisplay';
import { TransactionsTable } from '../_components/transactionsTable';
import { CloseTableDialog } from '../_components/closeTableDialog';
import LayoutFrame from '../../../_components/layoutFrame';
import IconText from '@/components/common/iconText';
import Wrap from '@/components/common/wrap';

//hooks
import { usePOSTCompanyDataHooks, usePUTCompanyDataHooks } from '@/hooks/company/companyDataHooks';
import { useGETRestaurantDataHooks, usePUTRestaurantDataHooks } from '@/hooks/restaurant/restaurantDataHooks';
import { useSocketIoHooks } from '@/hooks/useSocketIoHooks';
import { useAuthHooks } from '@/hooks/useAuthHooks';

//store
import { useOrderControllerStore } from '@/store/restaurant/orderController';
import { useTransactionsStore } from '@/store/company/transactions';
import { useTablesStore } from '@/store/restaurant/tables';
import { useOrderStore } from '@/store/restaurant/order';

//interfaces
import { ITransactions, TransactionsStatus } from '@/common/types/company/transactions.interface';
import { IOrder, IOrderController, OrderStatus } from '@/common/types/restaurant/order.interface';
import { RedirectTo } from '@/common/types/routers/endPoints.types';
import { ITable } from '@/common/types/restaurant/tables.interface';
import { SocketIoEvent } from '@/common/libs/socketIo/types';

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
    const { getOneOrderTotal } = useOrderStore()
    const { getTableById } = useTablesStore()
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

    const [isCloseTableDialogOpen, setIsCloseTableDialogOpen] = useState<boolean>(false)
    const remaining = getTotalOfOrdersByTableId(params.id) - getTransactionsTotalByFilter({
        payee_key: params.id,
        status: TransactionsStatus.CONFIRMED
    })

    const {
        restaurantAllPrinters: printers
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
        }
    })

    const {
        restaurantAllMenuSections: menuSections
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
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
        }
    })

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
        query: 'TABLES'
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
        }, {
            onSuccess: async () => {
                setIsCloseTableDialogOpen(false)
                await emit({
                    event: SocketIoEvent.TABLE,
                    message: params.id

                })
                await emit({
                    event: SocketIoEvent.TABLE_PAYMENT,
                    message: params.id
                })
                await emit({
                    event: SocketIoEvent.BOOKING,
                    message: params.id
                })
                push(RedirectTo.RECEPTION)
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
                    return oc?.orders?.map(o => {
                        return {
                            ...o,
                            paid: Number(o?.quantity) - Number(o?.paid)
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

    useEffect(()=> {
        const table = getTableById(params?.id)
        if(!table) {
            push('/admin/texas/reception')
        }
    }, [getTableById, params?.id, push])
    

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
                        <CloseTableDialog
                            isOpen={isCloseTableDialogOpen}
                            setIsOpen={setIsCloseTableDialogOpen}
                            onClose={handleCloseTable}
                        />
                        <i>Some info</i>
                    </div>
                ),
                return: {
                    action: () => remaining === 0 ? setIsCloseTableDialogOpen(prev => !prev) : push(RedirectTo.RECEPTION),
                }
            }}
            rightNavigation={{
                content: (
                    <RightReceptionDisplay
                        dataTable={dataTable}
                        getOrderControllers={getOrderControllers}
                        getOneOrderTotal={getOneOrderTotal}
                        menuSections={menuSections?.data || []}
                        createTransaction={createTransaction}
                        user={user}
                        updateOrder={updateOrder}
                        printers={printers?.data || []}
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