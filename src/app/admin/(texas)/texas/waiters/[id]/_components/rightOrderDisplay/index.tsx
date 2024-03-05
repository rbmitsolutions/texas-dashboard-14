import { UseMutateFunction } from "react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { useState } from "react"

//components
import { OrderSummary } from "../../../../_components/orderSummary"
import AuthDialog from "@/components/common/authDialog"
import { Button } from "@/components/ui/button"
import LastOrders from "./lastOrders"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ICreateNewOrder } from "@/store/restaurant/order"
import { ITable, ITableMealStatus } from "@/common/types/restaurant/tables.interface"
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface"
import { ISocketMessage, SocketIoEvent } from "@/common/libs/socketIo/types"
import { IToken, Permissions } from "@/common/types/auth/auth.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"

interface RightOrderDisplayProps {
    emit: (data: ISocketMessage) => void
    order: ICreateNewOrder[]
    resetOrder: () => void
    updateOrderQuantity: (order: ICreateNewOrder, incrise: boolean) => void
    deleteOrder: (orderId: string) => void
    getOneOrderTotal: (order: ICreateNewOrder) => number
    getOrderTotal: (orders: ICreateNewOrder[]) => number
    menu: IGETMenuOrderSystemResponse[]
    replaceOrder: (order: ICreateNewOrder) => void
    table: ITable
    createOrder: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    sections: IMenuSection[]
    orderControllers: IOrderController[]
}

export default function RightOrderDisplay({ emit, order, resetOrder, menu, getOrderTotal, updateOrderQuantity, getOneOrderTotal, deleteOrder, replaceOrder, table, createOrder, sections, orderControllers }: RightOrderDisplayProps) {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
    const { back } = useRouter()
    const [status, setStatus] = useState<ITableMealStatus>()

    const toggleAuthDialog = () => {
        setIsAuthDialogOpen(!isAuthDialogOpen)
    }


    const handleAuthDialogResponse = async (token: IToken) => {
        if (token) {
            await handleCreateOrder(token, order);
        }
    }

    const handleCreateOrder = async (taken: IToken, order: ICreateNewOrder[]) => {
        await createOrder(
            {
                order: {
                    many: {
                        orders: order,
                        order_controller: {
                            waiter: taken?.name,
                            waiter_id: taken?.user_id,

                            client_id: table?.client_id as string || 'walk_in',
                            table_id: table?.id,
                        },
                        update_table: {
                            id: table?.id,
                            meal_status: 'waiting'
                            // data: {
                            //     meal_status,
                            //     food_ordered_at: credentials?.hasfood ? new Date() : undefined,
                            // }
                        },
                    }
                }
            },
            {
                onSuccess: async () => {
                    resetOrder()
                    await emit({
                        event: SocketIoEvent.ORDER,
                        message: table?.id
                    })
                    await emit({
                        event: SocketIoEvent.TABLE,
                    })
                    back()
                },
                onError: (err) => {
                    toast.error('Something went wrong')
                },
            }
        );
    }



    return (
        <>
            <AuthDialog
                isOpen={isAuthDialogOpen}
                toggleAuthDialog={toggleAuthDialog}
                handleAuthResponse={handleAuthDialogResponse}
                permissions={[Permissions.WAITERS]}
                save={false}
            />

            <div className='flex-col-container h-full'>
                <div className='grid grid-cols-[1fr,auto,auto] gap-2'>
                    <LastOrders
                        ordersController={orderControllers}
                        menu={menu}
                        getOneOrderTotal={getOneOrderTotal}
                        sections={sections}
                    />
                    <Button
                        variant={status === 'all together' ? 'orange' : 'outline'}
                        className='w-full h-12'
                        onClick={() => setStatus(prev => prev === 'all together' ? undefined : 'all together')}
                    >
                        All Together
                    </Button>
                </div>
                <strong className='text-center'>Table: {table?.number}</strong>
                <div className='flex-col-container justify-start h-full p-2 rounded-lg overflow-auto scrollbar-thin -mt-2'>
                    {OrderSummary({
                        order: order?.map(o => {
                            const menuItem = menu?.find(m => m.id === o.menu_id)
                            return {
                                ...o,
                                menu: menuItem?.title,
                                menu_id: menuItem?.id,
                                menu_short_title: menuItem?.short_title,
                            }
                        }) as unknown as IOrder[],
                        updateOrder: {
                            deleteOrder,
                            updateOrderQuantity,
                            replaceOrder,
                            menu
                        },
                        getOneOrderTotal,
                        sections
                    })}
                </div>
                <Button
                    leftIcon="ShoppingCart"
                    className='h-14'
                    variant={order?.length === 0 ? 'destructive' : 'green'}
                    disabled={order?.length === 0}
                    onClick={() => toggleAuthDialog()}
                >
                    {convertCentsToEuro(getOrderTotal(order))}
                </Button>
            </div>
        </>
    )
}