'use client'

//hooks
import { useGETStockDataHooks, usePUTStockDataHooks } from "@/hooks/stock/stockDataHooks"

//interface
import { IStockSuppliers } from "@/common/types/restaurant/stock.interface"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import NewSupplierDialog from "../_components/newSupplierDialog"

const data: IStockSuppliers = {
    id: '1',
    title: 'Supplier 1',
    address: '123 Fake Street',
    auto_order: {
        id: '1',
        week_day: 'Monday',
        email: 'fakeemail@gmail.com',
        last_order_date: new Date(),
        supplier: {} as any,
        supplier_id: '1',

        created_at: new Date(),
        updated_at: new Date()
    },
    categories: [{
        id: '1',
        title: 'Bar',
        sub_categories: [],
        suppliers: [],
        created_at: new Date(),
        updated_at: new Date()
    }, {
        id: '2',
        title: 'Kitchen',
        sub_categories: [],
        suppliers: [],
        created_at: new Date(),
        updated_at: new Date()
    }],
    orders_controller: [],
    contacts: [],
    bank_details: [] as any,
    products: [],

    spent: 0,

    created_at: new Date(),
    updated_at: new Date()
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
                        oc: '1',
                        products: '1',

                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!params.id
        }
    })

    const {
        updateStockData: updateSupplier,
    } = usePUTStockDataHooks({
        query: 'SUPPLIERS',
        toRefetch
    })

    return (
        <div>
            <div className='relative'>
                <div className='flex-col-container justify-center items-center h-52 border-2 p-4 rounded-xl w-full bg-[url("/img/background.png")] bg-center bg-no-repeat bg-cover dark:opacity-60 dark:grayscale' />
                <div className='flex-col-container items-center gap-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <h1 className='font-bold text-4xl text-white'>{supplier?.title}</h1>
                    <small className='text-white text-center max-w-80'>{supplier?.address}</small>
                    <strong className='font-bold text-xl text-white'>{convertCentsToEuro(supplier?.spent || 0)}</strong>
                </div>
                <div className='absolute top-2 right-2'>
                    <NewSupplierDialog 
                        update={{
                            supplier,
                            updateSupplier
                        }}
                    />
                </div>
            </div>
        </div>
    )
}