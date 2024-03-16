
//components
import { Button } from "@/components/ui/button"

//interface
import { usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"
import { IPrinters } from "@/common/types/restaurant/printers.interface"
import { PrinterIcon } from "lucide-react"
import toast from "react-hot-toast"

interface PrintBillProps {
    tableId: string
    printers: IPrinters[]
}

export default function PrintBill({ printers, tableId }: PrintBillProps) {
    const {
        createRestaurantData: toPrint
    } = usePOSTRestaurantDataHooks({
        query: 'TO_PRINT',
    })

    const handlePrintOrder = async () => {
        const findReceiptPrinter = printers.find(p => p?.title?.toLowerCase() === 'reception')

        if(!findReceiptPrinter) return toast.error('There is no printer named "Reception"')
        await toPrint({
            toPrint: {
                bill: {
                    ip: findReceiptPrinter.ip,
                    tableId
                }
            }
        })
    }

    return (
        <Button
            className='h-14 w-14'
            variant='purple'
            onClick={handlePrintOrder}
        >
            <PrinterIcon  size={14}/>
        </Button>
    )
}