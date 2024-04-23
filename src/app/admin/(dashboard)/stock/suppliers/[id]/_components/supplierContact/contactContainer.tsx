import { UseMutateFunction } from "react-query"

//components
import CreateUpdateContact from "./createUpdateContact"
import IconText from "@/components/common/iconText"

//interface
import { IStockSupplierContacts } from "@/common/types/restaurant/stock.interface"
import { IPUTStockBody } from "@/hooks/stock/IPutStockDataHooks.interface"

interface ContactContainerProps {
    contact: IStockSupplierContacts
    updateContact: UseMutateFunction<any, any, IPUTStockBody, unknown>
}
export default function ContactContainer({ contact, updateContact }: ContactContainerProps) {
    return (
        <div className='flex-col-container gap-2 relative'>
            <div className='absolute top-2 right-2'>
                <CreateUpdateContact
                    supplier_id={contact?.supplier_id}
                    update={{
                        contact,
                        updateContact
                    }}
                />
            </div>
            <IconText
                icon="User"
                text={contact?.name || 'N/A'}
            />
            <IconText
                icon="Phone"
                text={contact?.contact_number || 'N/A'}
            />
            <IconText
                icon="Mail"
                text={contact?.email || 'N/A'}
            />
        </div>
    )
}