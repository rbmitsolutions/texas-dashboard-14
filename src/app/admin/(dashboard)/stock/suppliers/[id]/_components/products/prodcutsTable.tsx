'use client'
import { Dispatch, SetStateAction } from "react"
import { UseMutateFunction } from "react-query"

import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//components
import { StockProductsColumnsTable } from "./stockProductColumnsTable"

//hooks
import NewProductDialog from "./newProductDialog"

//interfaces
import { IPOSTStockBody, IPOSTStockDataRerturn } from "@/hooks/stock/IPostStockDataHooks.interface";
import { IGETAllStockProductsResponse, IGETStockDataQuery } from "@/hooks/stock/IGetStockDataHooks.interface";
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface";
import { IStockItem } from "@/common/types/restaurant/stock.interface";

interface ProductsTableProps {
    products: IGETAllStockProductsResponse
    productParams: IGETStockDataQuery
    setProductParams: Dispatch<SetStateAction<IGETStockDataQuery>>
    updateProduct: UseMutateFunction<any, any, IPUTStockBody, unknown>
    createProduct: UseMutateFunction<IPOSTStockDataRerturn, any, IPOSTStockBody, unknown>
    items: {
        items: IStockItem[]
        setItemsParams: Dispatch<SetStateAction<IGETStockDataQuery>>
        itemsParams: IGETStockDataQuery
    }
    supplier_id: string
}

export default function ProductsTable({
    products,
    productParams,
    setProductParams,
    createProduct,
    items,
    supplier_id,
}: ProductsTableProps) {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'Blocks',
                    title: 'Products'
                },
                pagination: {
                    onPageChange: (pagination) => setProductParams(prev => ({
                        product: {
                            all: {
                                ...prev?.product?.all,
                                pagination
                            }
                        }
                    })),
                    pagination: products?.pagination,
                    queryPagination: productParams?.product?.all?.pagination!,
                }
            }}
            actions={{
                searchInput: {
                    onSearchChange: (search) => setProductParams(prev => ({
                        product: {
                            all: {
                                ...prev?.product?.all,
                                code: search
                            }
                        }
                    })),
                    value: productParams?.product?.all?.code || '',
                    placeholder: 'Search by code'
                },
                toRight: (
                    <div >
                        <NewProductDialog
                            items={items}
                            createProduct={createProduct}
                            supplier_id={supplier_id}
                        />
                    </div >
                ),
                className: 'grid grid-cols-[1fr,auto]'
            }}
        >
            <BasicTable
                columns={StockProductsColumnsTable({
                })}
                data={products?.data || []}
            />
        </Wrap >
    )
}