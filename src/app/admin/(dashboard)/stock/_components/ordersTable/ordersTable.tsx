import { Dispatch, SetStateAction } from "react";

//components
import { StockOrderColumnsTable } from "./stockOrderColumnsTable";
import { BasicTable } from "@/components/common/basicTable";
import Wrap from "@/components/common/wrap";

//interface
import { IGETAllStockOrderResponse, IGETStockDataQuery } from "@/hooks/stock/IGetStockDataHooks.interface";

interface OrdersTableProps {
    orders: IGETAllStockOrderResponse
    setOrdersParams: Dispatch<SetStateAction<IGETStockDataQuery>>
    ordersParams: IGETStockDataQuery
}

export default function OrdersTable({
    orders,
    setOrdersParams,
    ordersParams,
}: OrdersTableProps) {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'PackageOpen',
                    title: 'Orders'
                },
                pagination: {
                    onPageChange: (pagination) => setOrdersParams(prev => ({
                        order: {
                            all: {
                                ...prev?.order?.all,
                                pagination
                            }
                        }
                    })),
                    queryPagination: ordersParams?.order?.all?.pagination!,
                    pagination: orders?.pagination
                }
            }}
        >
            <BasicTable
                columns={StockOrderColumnsTable({
                })}
                data={orders?.data || []}
            />
        </Wrap>
    )
}