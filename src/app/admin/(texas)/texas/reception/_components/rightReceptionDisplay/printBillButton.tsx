'use client'
import { PrinterIcon } from "lucide-react"

//components
import { Button } from "@/components/ui/button"

//hooks
import { usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//store
import { usePrintersStore } from "@/store/restaurant/printers"

//interface
import { TransactionsMethod } from "@/common/types/company/transactions.interface"

interface PrintBillProps {
    tableId?: string
    finishedTableId?: string
    giftCardId?: string
}

export default function PrintBill({ tableId, finishedTableId, giftCardId }: PrintBillProps) {
    const { defaultPrinter } = usePrintersStore()

    const {
        createRestaurantData: toPrint
    } = usePOSTRestaurantDataHooks({
        query: 'TO_PRINT',
    })

    const handlePrintOrder = async () => {
        if (!defaultPrinter) return

        if (tableId) {
            await toPrint({
                toPrint: {
                    bill: {
                        ip: defaultPrinter?.ip,
                        tableId,
                    }
                }
            })
        }

        if (finishedTableId) {
            await toPrint({
                toPrint: {
                    finishTableBill: {
                        ip: defaultPrinter?.ip,
                        finishedTableId: finishedTableId,
                    }
                }
            })
        }

        if(giftCardId) {
            await toPrint({
                toPrint: {
                    giftCardBalance: {
                        ip: defaultPrinter?.ip,
                        giftCardId,
                    }
                }   
            })
        }
    }

    return (
        <Button
            variant='pink'
            onClick={handlePrintOrder}
            disabled={!defaultPrinter}
            size='sm'
            type='button'
        >
            <PrinterIcon size={14} />
        </Button>
    )
}