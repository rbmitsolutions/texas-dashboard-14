import { useEffect, useState } from "react";

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import { formatDate } from "@/common/libs/date-fns/dateFormat";

//components
import Wrap from "@/components/common/wrap";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import FormDataDialog from "@/components/common/formDataDialog";
import ItemDescriptionDialog from "./itemDescriptionDialog";
import StockOrderInput from "./stockOrderInput";

//interfaces
import { IStockOrders, IStockOrdersController, IStockSuppliers } from "@/common/types/restaurant/stock.interface";
import { IOrderChange } from "../page";

interface StockOrderAuthorizedTableProps {
    orderController: IStockOrdersController
    orders: IStockOrders[]
    supplier: IStockSuppliers
    onOrderChange: (data: IOrderChange) => void
}

export default function StockOrderAuthorizedTable({ orderController, orders, supplier, onOrderChange }: StockOrderAuthorizedTableProps) {
    const [code, setCode] = useState<string>('')
    const [filteredOrders, setFilteredOrders] = useState<IStockOrders[]>([])

    const onCodeSearch = (code: string) => {
        setFilteredOrders(orders?.filter(order => order?.product?.code?.toLowerCase().includes(code?.toLowerCase())))
        setCode(code)
    }

    useEffect(() => {
        setFilteredOrders(orders)
    }, [orders])

    return (
        <Wrap
            header={{
                title: {
                    icon: 'PackageOpen',
                    title: supplier?.title
                }
            }}
            actions={{
                searchInput: {
                    onSearchChange: (code: string) => onCodeSearch(code),
                    value: code,
                    placeholder: 'Search by code'
                }
            }}
        >
            <Table className='rounded-md border'>
                <TableHeader >
                    <TableRow>
                        <TableHead className='w-40'>Code</TableHead>
                        <TableHead className='w-40'>Quantity</TableHead>
                        <TableHead className='min-w-48'>Product</TableHead>
                        <TableHead className='w-40'>Item</TableHead>
                        <TableHead className='w-40'>Delivery Date</TableHead>
                        <TableHead className='w-40'>Deposit</TableHead>
                        <TableHead className='w-40'>Vat</TableHead>
                        <TableHead className='w-48'>Price (unit)</TableHead>
                        <TableHead className='w-48'>Total</TableHead>
                        <TableHead className='w-40'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredOrders?.map(order => {
                        return (
                            <TableRow key={order.id}>
                                <TableCell>
                                    {order?.product?.code}
                                </TableCell>
                                <TableCell>
                                    {order?.product_quantity}
                                </TableCell>

                                <TableCell className='capitalize'>
                                    {order?.product?.title?.toLowerCase()}
                                </TableCell>
                                <TableCell>
                                    <ItemDescriptionDialog item={order?.item} />
                                </TableCell>
                                <TableCell>
                                    {order?.delivery_date ? formatDate({
                                        date: order?.delivery_date,
                                        f: 'dd/MM/yyyy'
                                    }) : '-'}
                                </TableCell>
                                <TableCell>
                                    <StockOrderInput
                                        onOrderChange={onOrderChange}
                                        orderId={order?.id}
                                        type="deposit"
                                        value={order?.deposit}
                                        inputProps={{
                                            disabled: orderController?.paid
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <StockOrderInput
                                            onOrderChange={onOrderChange}
                                            orderId={order?.id}
                                            type="vat"
                                            value={order?.vat}
                                            inputProps={{
                                                disabled: orderController?.paid
                                            }}
                                        />
                                        <strong>%</strong>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2 px-2'>
                                        <strong className='min-w-10'>{order?.product_quantity} x </strong>
                                        <StockOrderInput
                                            onOrderChange={onOrderChange}
                                            orderId={order?.id}
                                            type="one_product_price"
                                            value={order?.one_product_price}
                                            inputProps={{
                                                disabled: orderController?.paid
                                            }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <strong>
                                        {convertCentsToEuro(order?.total)}
                                    </strong>
                                </TableCell>
                                <TableCell className='flex-container items-center'>
                                    <DeleteDialogButton
                                        onDelete={() => console.log('delete')}

                                    />
                                    <FormDataDialog
                                        formDataId={order?.haccp_data_id}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </Wrap>
    )
}