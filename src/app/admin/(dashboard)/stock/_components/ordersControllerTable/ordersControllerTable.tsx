import { Dispatch, SetStateAction } from "react";
import { UseMutateFunction } from "react-query";

//components
import { StockOrderControllerColumns } from "./stockOrderControllerColumnsTable";
import { BasicTable } from "@/components/common/basicTable";
import Wrap from "@/components/common/wrap";

//interface
import { IGETAllStockOrderControllerResponse, IGETStockDataQuery } from "@/hooks/stock/IGetStockDataHooks.interface";
import { IDELETEStockDataBody } from "@/hooks/stock/IDeleteStockDataHooks.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";

interface OrdersControllerTableProps {
    setOrdersControllerParams: Dispatch<SetStateAction<IGETStockDataQuery>>
    ordersControllerParams: IGETStockDataQuery
    ordersController: IGETAllStockOrderControllerResponse
    updateOrderController: UseMutateFunction<any, any, IPUTStockBody, unknown>
    deleteOrderController: UseMutateFunction<void, any, IDELETEStockDataBody, unknown>
}

export default function OrdersControllerTable({
    ordersController,
    setOrdersControllerParams,
    ordersControllerParams,
    updateOrderController,
    deleteOrderController
}: OrdersControllerTableProps) {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'PackageOpen',
                    title: 'Orders'
                },
                pagination: {
                    onPageChange: (pagination) => setOrdersControllerParams(prev => ({
                        order_controller: {
                            all: {
                                ...prev?.order_controller?.all,
                                pagination
                            }
                        }
                    })),
                    pagination: ordersController?.pagination,
                    queryPagination: ordersControllerParams?.order_controller?.all?.pagination!,
                }
            }}
            actions={{
                searchInput: {
                    onSearchChange: (search) => setOrdersControllerParams(prev => ({
                        order_controller: {
                            all: {
                                ...prev?.order_controller?.all,
                                supplier: {
                                    title: search
                                }
                            }
                        }
                    })),
                    value: ordersControllerParams?.order_controller?.all?.supplier?.title || '',
                    placeholder: 'Search by supplier'
                },
                optionsPopover: {
                    isLoading: !ordersController,
                    options: [{
                        label: 'Paid',
                        placeholder: 'Paid',
                        options: [
                            {
                                label: 'All',
                                value: 'all'
                            },
                            {
                                label: 'Yes',
                                value: '1'
                            },
                            {
                                label: 'No',
                                value: '0'
                            }
                        ],
                        value: ordersControllerParams?.order_controller?.all?.paid || 'all',
                        onChange: (e) => setOrdersControllerParams(prev => ({
                            order_controller: {
                                all: {
                                    ...prev?.order_controller?.all,
                                    paid: e == 'all' ? undefined : e as '0' | '1'
                                }
                            }
                        }))
                    }]
                },
                className: 'grid grid-cols-[1fr,auto] gap-2 items-center'
            }}
        >
            <BasicTable
                columns={StockOrderControllerColumns({
                    updateOrderController,
                    deleteOrderController
                })}
                data={ordersController?.data || []}
            />
        </Wrap >
    )
}