'use client'

//components
import { StockSuppliersColumnsTable } from "./_components/suppliersColumnsTable"
import NewSupplierDialog from "./_components/newSupplierDialog"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//hooks
import { useGETStockDataHooks, usePOSTStockDataHooks } from "@/hooks/stock/stockDataHooks"

export default function Suppliers() {

    const {
        stockAllSuppliers: suppliers,
        GETStockDataParams: params,
        setGETStockDataParams: setParams,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'SUPPLIERS',
        defaultParams: {
            supplier: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        oc: '1',
                        products: '1',
                        categories: '1'
                    }
                }
            }
        }
    })

    const {
        stockAllCategory: categories,
    } = useGETStockDataHooks({
        query: 'CATEGORY',
        defaultParams: {
            category: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 500
                    },
                }
            }
        }
    })

    const {
        createStockData: createSupplier
    } = usePOSTStockDataHooks({
        query: 'SUPPLIERS',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    icon: 'Building2',
                    title: 'Suppliers'
                },
                pagination: {
                    onPageChange: (pagination) => setParams(prev => ({
                        supplier: {
                            all: {
                                ...prev?.supplier?.all,
                                pagination
                            }
                        }
                    })),
                    pagination: suppliers?.pagination,
                    queryPagination: params?.supplier?.all?.pagination!,
                }
            }}
            actions={{
                toRight: (
                    <div className='flex justify-end items-center gap-4'>
                        <NewSupplierDialog
                            createSupplier={createSupplier}
                            categories={categories?.data || []}
                        />
                    </div >
                ),
            }}
        >
            <BasicTable
                columns={StockSuppliersColumnsTable({})}
                data={suppliers?.data || []}
            />
        </Wrap>
    )
}