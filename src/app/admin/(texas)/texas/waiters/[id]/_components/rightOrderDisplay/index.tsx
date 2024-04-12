import { UseMutateFunction } from "react-query"
import { useRouter } from "next/navigation"

//libs
import { useState } from "react"

//components
import PrintBill from "../../../../reception/_components/rightReceptionDisplay/printBillButton"
import { OrderSummary } from "../../../../_components/orderSummary"
import AuthDialog from "@/components/common/authDialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import ChangeGuests from "./changeGuests"
import ChangeTable from "./changeTable"
import LastOrders from "./lastOrders"

//interface
import { IGETMenuOrderSystemResponse } from "@/hooks/restaurant/IGetRestaurantDataHooks.interface"
import { ITable, TableMealStatus } from "@/common/types/restaurant/tables.interface"
import { IPOSTRestaurantBody, IPOSTRestaurantDataRerturn } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPUTRestaurantBody } from "@/hooks/restaurant/IPutRestaurantDataHooks.interface"
import { IOrder, IOrderController } from "@/common/types/restaurant/order.interface"
import { hasOrdersWithOrderedStatus } from "@/common/libs/restaurant/order"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { IToken, Permissions } from "@/common/types/auth/auth.interface"
import { IMenuSection } from "@/common/types/restaurant/menu.interface"
import { RedirectTo } from "@/common/types/routers/endPoints.types"
import { ICreateNewOrder } from "@/store/restaurant/order"
import { ErrorMessages } from "@/common/types/messages"

interface RightOrderDisplayProps {
    order: ICreateNewOrder[]
    resetOrder: () => void
    updateOrderQuantity: (order: ICreateNewOrder, incrise: boolean) => void
    deleteOrder: (orderId: string) => void
    menu: IGETMenuOrderSystemResponse[]
    replaceOrder: (order: ICreateNewOrder) => void
    table: ITable
    createOrder: UseMutateFunction<IPOSTRestaurantDataRerturn, any, IPOSTRestaurantBody, unknown>
    menuSections: IMenuSection[]
    orderControllers: IOrderController[]
    printers: IPrinters[]
    updateTable: UseMutateFunction<any, any, IPUTRestaurantBody, unknown>
}

export default function RightOrderDisplay({ order, resetOrder, menu, updateOrderQuantity, deleteOrder, replaceOrder, table, createOrder, menuSections, orderControllers, printers, updateTable }: RightOrderDisplayProps) {
    const [toPrint, setToPrint] = useState<boolean>(true)
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
    const { push } = useRouter()
    const [status, setStatus] = useState<TableMealStatus>()

    const toggleAuthDialog = () => {
        setToPrint(true)
        setIsAuthDialogOpen(!isAuthDialogOpen)
    }

    const handleAuthDialogResponse = async (token: IToken) => {
        if (token) {
            await handleCreateOrder(token, order);
        }
    }

    const handleCreateOrder = async (taken: IToken, order: ICreateNewOrder[]) => {
        const coordinates = hasOrdersWithOrderedStatus(order as IOrder[], menuSections)

        let meal_status: TableMealStatus = table?.meal_status

        if ((meal_status === TableMealStatus.DESSERT) && coordinates?.hasfood) {
            meal_status = TableMealStatus.MAIN
        }

        if (coordinates?.hasfood && !status) {
            if (meal_status === TableMealStatus.WAITING) {
                if (coordinates?.starters) {
                    meal_status = TableMealStatus.STARTERS
                }

                if (coordinates?.maincourse && !coordinates?.starters) {
                    meal_status = TableMealStatus.MAIN
                }
            }
        }

        if (status) {
            meal_status = status
        }

        if (table?.meal_status === TableMealStatus.PREPARING) {
            meal_status = TableMealStatus.PREPARING
        }

        const ocTotal = order.reduce((acc, curr) => acc + curr.total, 0);

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
                            total: ocTotal
                        },
                        update_table: {
                            id: table?.id,
                            meal_status,
                            food_ordered_at: coordinates?.hasfood ? new Date() : undefined,
                        },
                        toPrint: toPrint ? '1' : undefined
                    }
                }
            },
            {
                onSuccess: async () => {
                    setToPrint(true)
                    resetOrder()
                    push(RedirectTo.WAITERS)
                },
                onError: (err) => {
                    if (err?.response?.data?.message === ErrorMessages.TABLE_IS_CLOSED) {
                        resetOrder()
                        push(RedirectTo.WAITERS)
                    }
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
                titleDom={
                    <div className='m-auto'>
                        <Label
                            className='flex-container items-center bg-orange-300 p-2 bg-background-soft'
                        >
                            PRINT ORDER
                            <Switch
                                className='m-auto'
                                checked={toPrint}
                                onCheckedChange={(checked) => setToPrint(checked)}
                            />
                        </Label>
                    </div>
                }
            />

            <div className='flex-col-container h-full'>
                <div className='grid grid-cols-[auto,auto,auto,auto,auto] items-center gap-2'>
                    <ChangeTable
                        updateTable={updateTable}
                        table={table}
                    />
                    <LastOrders
                        ordersController={orderControllers}
                        menu={menu}
                        menuSections={menuSections}
                        printers={printers}
                    />
                    <ChangeGuests
                        table={table}
                        updateTable={updateTable}
                    />
                    <Button
                        variant={status === TableMealStatus.ALL_TOGETHER ? 'orange' : 'outline'}
                        onClick={() => setStatus(prev => prev === TableMealStatus.ALL_TOGETHER ? undefined : TableMealStatus.ALL_TOGETHER)}
                        size='sm'
                    >
                        All Together
                    </Button>
                    <PrintBill
                        tableId={table?.id}
                    />
                </div>
                <strong className='text-center'>Table: {table?.number}</strong>
                <div
                    id='order-summary-container'
                    className='flex-col-container justify-start direction-reverse h-full p-2 rounded-lg overflow-auto   scrollbar-thin -mt-2'>
                    <OrderSummary
                        order={order?.map(o => {
                            const menuItem = menu?.find(m => m.id === o.menu_id)
                            return {
                                ...o,
                                menu: menuItem?.title,
                                menu_id: menuItem?.id,
                                menu_short_title: menuItem?.short_title,
                            }
                        }) as unknown as IOrder[]}
                        updateOrder={{
                            deleteOrder,
                            updateOrderQuantity,
                            replaceOrder,
                            menu
                        }}
                        menuSections={menuSections}
                    />
                </div>
                <Button
                    leftIcon="ShoppingCart"
                    className='h-14'
                    variant={order?.length === 0 ? 'destructive' : 'green'}
                    disabled={order?.length === 0}
                    onClick={() => toggleAuthDialog()}
                >
                    Send Order
                </Button>

            </div>
        </>
    )
}

