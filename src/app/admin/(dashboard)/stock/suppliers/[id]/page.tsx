'use client'

//components
import OrdersControllerTable from "../../_components/ordersControllerTable/ordersControllerTable"
import CreateUpdateContact from "./_components/supplierContact/createUpdateContact"
import ContactContainer from "./_components/supplierContact/contactContainer"
import NewSupplierDialog from "../_components/newSupplierDialog"
import ProductsTable from "./_components/products/prodcutsTable"
import CreateUpdateBank from "./_components/supplierBank"
import SupplierAnalytics from "./_components/analytics"

//hooks
import { useDELETEStockDataHooks, useGETStockDataHooks, usePOSTStockDataHooks, usePUTStockDataHooks } from "@/hooks/stock/stockDataHooks"
import SupplerAutoOrderForm from "./[product]/_components/supplerAutoOrderForm"

const styles = {
    container: 'p-4 bg-background-soft shadow-sm'
}

export default function Supplier({ params }: { params: { id: string } }) {
    const {
        stockSupplier: supplier,
        refetchStockData: toRefetch
    } = useGETStockDataHooks({
        query: 'SUPPLIERS',
        defaultParams: {
            supplier: {
                byId: {
                    id: params.id,
                    include: {
                        contacts: '1',
                        bank: '1',
                        oc: '1',
                        products: '1',
                        auto_order: '1',
                        categories: '1',
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        stockAllProducts: products,
        GETStockDataParams: productsParams,
        setGETStockDataParams: setProductsParams,
        refetchStockData: toRefetchProducts
    } = useGETStockDataHooks({
        query: 'PRODUCT',
        defaultParams: {
            product: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        item: '1',
                        orders: '1',
                    },
                    supplier_id: {
                        in: [params.id]
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        stockAllOrderController: ordersController,
        GETStockDataParams: ordersControllerParams,
        setGETStockDataParams: setOrdersControllerParams,
        refetchStockData: toRefetchOrderController
    } = useGETStockDataHooks({
        query: 'ORDER_CONTROLLER',
        defaultParams: {
            order_controller: {
                all: {
                    supplier: {
                        id: [params.id]
                    },
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                    include: {
                        orders: '1',
                        supplier: '1',
                    },
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
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
        stockAllItem: items,
        GETStockDataParams: itemsParams,
        setGETStockDataParams: setItemsParams,
    } = useGETStockDataHooks({
        query: 'ITEM',
        defaultParams: {
            item: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 20
                    },
                },
            }
        }
    })

    const {
        createStockData: createProduct
    } = usePOSTStockDataHooks({
        query: 'PRODUCT',
        toRefetch: toRefetchProducts
    })

    const {
        updateStockData: updateProduct,
    } = usePUTStockDataHooks({
        query: 'PRODUCT',
        toRefetch: toRefetchProducts
    })

    const {
        updateStockData: updateSupplier,
    } = usePUTStockDataHooks({
        query: 'SUPPLIERS',
        toRefetch
    })

    const {
        createStockData: createContact
    } = usePOSTStockDataHooks({
        query: 'SUPPLIER_CONTACT',
        toRefetch
    })

    const {
        updateStockData: updateContact,
    } = usePUTStockDataHooks({
        query: 'SUPPLIER_CONTACT',
        toRefetch
    })

    const {
        createStockData: createBank
    } = usePOSTStockDataHooks({
        query: 'SUPPLIER_BANK',
        toRefetch
    })

    const {
        updateStockData: updateBank,
    } = usePUTStockDataHooks({
        query: 'SUPPLIER_BANK',
        toRefetch
    })

    const {
        createStockData: createAutoOrder
    } = usePOSTStockDataHooks({
        query: 'SUPPLIER_AUTO_ORDER',
        toRefetch
    })

    const {
        updateStockData: updateAutoOrder,
    } = usePUTStockDataHooks({
        query: 'SUPPLIER_AUTO_ORDER',
        toRefetch
    })

    const {
        updateStockData: updateOrderController
    } = usePUTStockDataHooks({
        query: 'ORDER_CONTROLLER',
        toRefetch: toRefetchOrderController
    })

    const {
        deleteStockData: deleteOrderController
    } = useDELETEStockDataHooks({
        query: 'ORDER_CONTROLLER',
        toRefetch: toRefetchOrderController
    })

    return (
        <div>
            <div className='grid grid-cols-1 gap-4'>
                <div className='flex-col-container'>
                    <div className={styles.container}>
                        <div className='flex-col-container item-center'>
                            <div className='flex-col-container justify-center items-center h-40 rounded-md w-full bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:opacity-60 dark:grayscale' />
                            <div className='flex-col-container gap-2 items-center p-4 -mt-20 z-10 max-w-80 rounded-lg m-auto bg-background shadow-md'>
                                <h1 className='font-bold text-2xl text-center'>{supplier?.title}</h1>
                                <small className='text-center max-w-80'>{supplier?.address}</small>
                                <div className='flex flex-wrap items-center justify-center gap-2'>
                                    {supplier?.categories?.map(cat => {
                                        return (
                                            <span key={cat.id} className='text-xs bg-background-soft rounded-full px-2 py-1'>{cat.title}</span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='flex-col-container justify-center mt-4'>
                            <div className='flex-container justify-center'>
                                <NewSupplierDialog
                                    update={{
                                        supplier,
                                        updateSupplier
                                    }}
                                    categories={categories?.data || []}
                                />
                                <CreateUpdateContact
                                    supplier_id={params.id}
                                    createContact={createContact}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        {supplier?.contacts?.map(contact => {
                            return (
                                <div
                                    key={contact.id}
                                    className={styles.container}
                                >
                                    <ContactContainer
                                        contact={contact}
                                        updateContact={updateContact}
                                    />
                                </div>
                            )
                        })}
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className={styles.container}>
                            <CreateUpdateBank
                                bank={supplier?.bank_details}
                                createBank={createBank}
                                supplier_id={params.id}
                                updateBank={updateBank}
                            />
                        </div>
                        <div className={styles.container}>
                            <SupplerAutoOrderForm
                                supplier_id={params.id}
                                createSupplierAutoOrder={createAutoOrder}
                                update={{
                                    updateSupplierAutoOrder: updateAutoOrder,
                                    auto_order: supplier?.auto_order
                                }}
                            />
                        </div>
                    </div>
                </div>
                <main className='flex-col-container gap-8'>
                    <SupplierAnalytics
                        supplier_id={params.id}
                    />
                    <div className={styles?.container}>
                        <OrdersControllerTable
                            ordersController={ordersController}
                            ordersControllerParams={ordersControllerParams}
                            setOrdersControllerParams={setOrdersControllerParams}
                            updateOrderController={updateOrderController}
                            deleteOrderController={deleteOrderController}
                        />
                    </div>
                    <div className={styles?.container}>
                        <ProductsTable
                            products={products}
                            productParams={productsParams}
                            setProductParams={setProductsParams}
                            createProduct={createProduct}
                            updateProduct={updateProduct}
                            items={{
                                items: items?.data || [],
                                itemsParams,
                                setItemsParams
                            }}
                            supplier_id={params.id}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}
