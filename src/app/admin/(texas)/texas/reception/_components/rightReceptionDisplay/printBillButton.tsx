import toast from "react-hot-toast"
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
    tableId: string
}

export default function PrintBill({ tableId }: PrintBillProps) {
    const { defaultPrinter } = usePrintersStore()

    const {
        createRestaurantData: toPrint
    } = usePOSTRestaurantDataHooks({
        query: 'TO_PRINT',
    })

    const handlePrintOrder = async () => {
        if(!defaultPrinter) return

        await toPrint({
            toPrint: {
                bill: {
                    ip: defaultPrinter?.ip,
                    tableId,
                }
            }
        })
    }

    return (
        <Button
            variant='pink'
            onClick={handlePrintOrder}
            disabled={!defaultPrinter}
        >
            <PrinterIcon size={14} />
        </Button>
    )
}