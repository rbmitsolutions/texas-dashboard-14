import { IStockOrders, IStockSuppliers } from "@/common/types/restaurant/stock.interface";
import { BasicTable } from "@/components/common/basicTable";
import Wrap from "@/components/common/wrap";
import { StockOrderAuthorizedColumns } from "./ordersAuthorizedColumns";

interface StockOrderAuthorizedTableProps {
    orders: IStockOrders[]
    supplier: IStockSuppliers
}

export default function StockOrderAuthorizedTable({ orders, supplier }: StockOrderAuthorizedTableProps) {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'PackageOpen',
                    title: supplier?.title
                }
            }}
        >
            <BasicTable
                columns={StockOrderAuthorizedColumns({})}
                data={orders}
            />
        </Wrap>
    )
}