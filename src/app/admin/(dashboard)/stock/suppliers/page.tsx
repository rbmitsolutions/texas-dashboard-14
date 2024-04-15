'use client'

//components
import { StockSuppliersColumnsTable } from "@/app/admin/(dashboard)/stock/suppliers/_components/suppliersColumns"
import { BasicTable } from "@/components/common/basicTable"
import Wrap from "@/components/common/wrap"

//interfaces
import { IStockSuppliers } from "@/common/types/restaurant/stock.interface"
import NewSupplierDialog from "./_components/newSupplierDialog"

const data: IStockSuppliers[] = [
    {
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
        auto_order_id: 'undefined',
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
        bank_details: [],
        products: [],

        spent: 0,

        created_at: new Date(),
        updated_at: new Date()
    }
]

export default function Suppliers() {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'Building2',
                    title: 'Suppliers'
                },
                pagination: {
                    onPageChange: () => { },
                    pagination: {
                        currentPage: 1,
                        hasNextPage: true,
                        maxPages: 2
                    },
                    queryPagination: {
                        skip: 0,
                        take: 20
                    },
                }
            }}
            actions={{
                toRight: (
                    <div className='flex justify-end items-center gap-4'>
                        <NewSupplierDialog />
                    </div >
                ),
            }}
        >
            <BasicTable
                columns={StockSuppliersColumnsTable({})}
                data={data}
            />
        </Wrap>
    )
}