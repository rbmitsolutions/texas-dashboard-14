import { UseMutateFunction } from "react-query"
import toast from "react-hot-toast"
import { useState } from "react"

//libs
import Icon from "@/common/libs/lucida-icon"

//components
import { getOrderStatusVariant, getOrderTotal } from "@/common/libs/restaurant/order"
import { IOrder, OrderStatus } from "@/common/types/restaurant/order.interface"
import AuthDialog from "@/components/common/authDialog"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

//store
import { useTablesStore } from "@/store/restaurant/tables"

//interface
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IToken, Permissions } from "@/common/types/auth/auth.interface"
import { ITable } from "@/common/types/restaurant/tables.interface"
import { ErrorMessages } from "@/common/types/messages"

interface UpdateOrderStatusProps {
    order: IOrder
    onUpdate: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
    createOrder: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
}

export default function UpdateOrderStatus({ order, onUpdate, createOrder }: UpdateOrderStatusProps) {
    const { getTablesFiltered } = useTablesStore()
    const [selectedTable, setSelectedTable] = useState<ITable | undefined>(undefined)
    const [updateOrder, setUpdatOrder] = useState<IOrder>(order)
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const onOpenChange = () => {
        setSelectedTable(undefined)
        setIsOpen(!isOpen)
    }

    const handleUpdate = async (o: IOrder) => {
        await onUpdate({
            order: {
                order: {
                    id: o.id,
                    data: {
                        quantity: o?.quantity,
                        status: o?.status,
                        total: o?.total,
                    }
                }
            }
        }, {
            onSuccess: () => {
                setIsOpen(false)
            }
        })
    }


    const handleCreateOrder = async (token: IToken, order: IOrder) => {
        await createOrder(
            {
                order: {
                    many: {
                        orders: [{
                            add_ons: order?.add_ons,
                            menu: order?.menu,
                            quantity: order?.quantity,
                            status: order?.status,
                            price: order?.price,
                            menu_id: order?.menu_id,
                            menu_short_title: order?.menu_short_title,
                            mn_section: order?.mn_section,
                            mn_type: order?.mn_type,
                            to_print_ips: order?.to_print_ips,
                            total: order?.total
                        }],
                        order_controller: {
                            waiter: token?.name,
                            waiter_id: token?.user_id,
                            client_id: selectedTable?.client_id! as string,
                            table_id: selectedTable?.id!,
                            total: order?.total
                        },
                        update_table: {
                            id: selectedTable?.id!,
                        },
                    }
                }
            },
            {
                onSuccess: async () => {
                    setIsOpen(false)
                    await handleUpdate({
                        ...updateOrder,
                        id: updateOrder?.id,
                        status: OrderStatus.CANCELLED,
                        total: 0
                    })
                },
                onError: (err) => {
                    if (err?.response?.data?.message === ErrorMessages.TABLE_IS_CLOSED) {
                        toast.error('Table is closed')
                    }
                },
            }
        );
    }

    const handleSuccess = async (user: IToken, order: IOrder) => {
        setIsOpen(false);
        const update = {
            ...order,
            status: selectedTable ? OrderStatus.CANCELLED : order?.status,
            total: selectedTable ? 0 : order?.total
        }

        if (selectedTable) {
            await handleCreateOrder(user, order)
        }

        if (!selectedTable) {
            await handleUpdate(update)
        }
    }

    const handleUpdateOrderQuantity = async (order: IOrder, direction: 'plus' | 'minus') => {
        if (direction === 'plus') {
            setUpdatOrder({
                ...order,
                quantity: order?.quantity + 1,
                total: getOrderTotal({
                    ...order,
                    quantity: order?.quantity + 1
                })
            })
        }

        if (direction === 'minus') {
            setUpdatOrder({
                ...order,
                quantity: order?.quantity - 1,
                total: getOrderTotal({
                    ...order,
                    quantity: order?.quantity - 1
                })
            })
        }
    }

    return (
        <>
            <AuthDialog
                isOpen={isAuthOpen}
                toggleAuthDialog={() => setIsAuthOpen(!isAuthOpen)}
                handleAuthResponse={(user) => handleSuccess(user, updateOrder)}
                permissions={[Permissions.RECEPTION]}
            />
            <Dialog
                open={isOpen}
                onOpenChange={onOpenChange}
            >
                <DialogTrigger asChild>
                    <Button
                        leftIcon="RefreshCw"
                        size='sm'
                        variant='secondary'
                        onClick={() => setIsOpen(true)}
                        className='w-20'
                        disabled={order?.status === OrderStatus.CANCELLED}
                    >
                        Update
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className='capitalize'>{order?.menu}</DialogTitle>
                    </DialogHeader>
                    <div className='flex-col-container gap-4'>
                        <div className="flex-col-container border-2 rounded-xl p-2">
                            <div className='flex-container gap-4 overflow-auto max-w-sm scrollbar-thin'>
                                {getTablesFiltered({
                                    is_open: true,
                                })?.map(table => {
                                    return (
                                        <Button
                                            key={table?.id}
                                            className='flex-col-container items-center justify-center p-2 gap-1 min-h-20 cursor-pointer'
                                            variant={selectedTable?.id === table?.id ? 'default' : 'outline'}
                                            onClick={() => setSelectedTable(table)}
                                        >
                                            <strong>
                                                Table - {table?.number}
                                            </strong>
                                            <small>
                                                {table?.guests} Guests
                                            </small>
                                        </Button>
                                    )
                                })}
                            </div>
                            <div className='grid grid-cols-[auto,1fr] gap-4'>
                                <div className='flex items-center'>
                                    <Button
                                        disabled={updateOrder?.quantity === 1}
                                        onClick={() => handleUpdateOrderQuantity(updateOrder, 'minus')}
                                        size='iconExSm'
                                    >
                                        <Icon name='Minus' size={14} />
                                    </Button>
                                    <span className='text-center w-8'>{updateOrder?.quantity}</span>
                                    <Button
                                        onClick={() => handleUpdateOrderQuantity(updateOrder, 'plus')}
                                        size='iconExSm'
                                    >
                                        <Icon name='Plus' size={14} />
                                    </Button>
                                </div>
                                <Button
                                    className='w-full h-14'
                                    variant='green'
                                    onClick={() => {
                                        setIsAuthOpen(true)
                                    }}
                                >
                                    {selectedTable ? `Change to Table ${selectedTable?.number}` : 'Update'}
                                </Button>
                            </div>
                        </div>
                        <Button
                            className='capitalize h-14 '
                            variant={getOrderStatusVariant(OrderStatus.CANCELLED)}
                            onClick={() => {
                                setUpdatOrder({ ...updateOrder, status: OrderStatus.CANCELLED, total: 0 })
                                setIsAuthOpen(true)
                            }}
                        >
                            Cancelled
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}