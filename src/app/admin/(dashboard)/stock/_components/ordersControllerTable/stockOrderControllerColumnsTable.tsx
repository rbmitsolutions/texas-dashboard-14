"use client"
import { UseMutateFunction } from "react-query"
import toast from "react-hot-toast"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { api } from "@/common/libs/axios/api"
import Icon from "@/common/libs/lucida-icon"

//components
import LinkButton from "@/components/common/linkButton"
import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

//interface
import { IStockOrdersController } from "@/common/types/restaurant/stock.interface"
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface"
import { EndPointsTypes, RedirectTo } from "@/common/types/routers/endPoints.types"
import { IDELETEStockDataBody } from "@/hooks/stock/IDeleteStockDataHooks.interface"
import { IFiles } from "@/common/types/company/files.interface"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

export interface StockOrderControllerColumnsProps {
    updateOrderController: UseMutateFunction<any, any, IPUTStockBody, unknown>
    deleteOrderController: UseMutateFunction<void, any, IDELETEStockDataBody, unknown>
}

const onDownload = async (file_id: string) => {
    try {
        const { data } = await api.get<IFiles>(EndPointsTypes.COMPANY_FILES_ENDPOINT, {
            params: {
                files: {
                    byId: {
                        id: file_id
                    }
                }
            }
        })

        const link = document.createElement('a')
        link.href = data.url
        link.download = data.title
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)


    } catch (err) {
        toast.error('File not found!')
    }
};

export const StockOrderControllerColumns = ({
    updateOrderController,
    deleteOrderController
}: StockOrderControllerColumnsProps): ColumnDef<IStockOrdersController>[] => {
    return [
        {
            accessorKey: "created_at",
            header: () => <div className="text-left">Date</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <div>
                        {formatDate({
                            date: row?.original?.created_at,
                            f: 'dd/MM/yy'
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: "supplier",
            header: () => <div className="text-left">Supplier</div>,
            size: 400,
            cell: ({ row }) => {
                return (
                    <div className='capitalize'>
                        {row?.original?.supplier?.title?.toLowerCase()}
                    </div>
                )
            }
        },
        {
            accessorKey: "orders",
            header: () => <div className="text-left">Orders</div>,
            size: 100,
            cell: ({ row }) => {
                return (
                    <strong className='flex-container gap-1'>
                        {row?.original?.orders?.length} Orders
                    </strong>
                )
            }
        },
        {
            accessorKey: "total",
            header: () => <div className="text-left">Total</div>,
            size: 100,
            cell: ({ row }) => {
                const hasOrderNotDelivered = row?.original?.orders?.some(order => !order?.delivery_date)
                const total = row?.original?.orders?.reduce((acc, order) => acc + order?.total, 0)
                return (
                    <div>
                        {hasOrderNotDelivered ? 'Not Delivered' : convertCentsToEuro(total)}
                    </div>
                )
            }
        },
        {
            accessorKey: "paid",
            header: () => <div className="text-left">Paid</div>,
            size: 100,
            cell: ({ row }) => {
                const hasOrderNotDelivered = row?.original?.orders?.some(order => !order?.delivery_date)

                return (
                    <div>
                        <Switch
                            disabled={hasOrderNotDelivered}
                            checked={row?.original?.paid }
                            onCheckedChange={async () => await updateOrderController({
                                order_controller: {
                                    id: row?.original?.id,
                                    paid: !row?.original?.paid
                                }
                            })}
                        />
                    </div>
                )
            }
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-left">Action</div>,
            size: 40,
            cell: ({ row }) => {
                return (
                    <div className='flex-container items-center gap-4'>
                        <LinkButton
                            className="bg-orange-400 dark:bg-orange-500 hover:bg-orange-500 dark:hover:bg-orange-600"
                            icon="Building2"
                            href={RedirectTo.SUPPLIER_PROFILE + `/${row?.original?.supplier_id}`}
                        />
                        <DeleteDialogButton
                            onDelete={async () => await deleteOrderController({
                                order_controller: {
                                    id: row?.original?.id
                                }
                            })
                            }
                            isDisabled={row?.original?.orders?.length > 0}
                        />
                        <Button
                            disabled={!row?.original?.file_id}
                            size='iconSm'
                            onClick={() => onDownload(row.original.file_id!)}

                        >
                            <Icon name='FileText' size={18} />
                        </Button>
                        <LinkButton
                            href={RedirectTo.STOCK_ORDER_CONTROLLER_PROFILE + `/${row?.original?.id}`}
                        />
                    </div>
                )
            }
        },

    ]

}