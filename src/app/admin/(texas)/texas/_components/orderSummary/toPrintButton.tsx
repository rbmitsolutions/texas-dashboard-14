import { PrinterIcon } from "lucide-react"

//components
import { IOrderController } from "@/common/types/restaurant/order.interface"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

//hooks
import { usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks"

//interface
import { IPOSTToPrintBody } from "@/hooks/restaurant/IPostRestaurantDataHooks.interface"
import { IPrinters } from "@/common/types/restaurant/printers.interface"

interface ToPrintButtonProps {
    orderController: IOrderController
    printers: IPrinters[]
}

export default function ToPrintButton({ orderController, printers }: ToPrintButtonProps) {

    const {
        createRestaurantData: toPrint
    } = usePOSTRestaurantDataHooks({
        query: 'TO_PRINT',
    })

    const handlePrintOrder = async (data: IPOSTToPrintBody) => {
        await toPrint({
            toPrint: {
                ...data
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size='iconSm'
                    variant='pink'
                    className='w-full'
                >
                    <PrinterIcon size={14} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div>
                    <div className='grid grid-cols-3 gap-2'>
                        {printers?.map(p => {
                            return (
                                <Button
                                    key={p?.id}
                                    className='text-wrap h-20 min-h-18'
                                    variant='outline'
                                    onClick={() => handlePrintOrder({
                                        to: {
                                            ip: p?.ip,
                                            orderControllerId: orderController?.id,
                                            tableId: orderController?.table_id!,
                                        }
                                    })}
                                >
                                    {p?.title}
                                </Button>
                            )
                        })}
                    </div>
                    <Button
                        className='w-full mt-4 h-20'
                        variant='purple'
                        leftIcon="Printer"
                        onClick={() => handlePrintOrder({
                            order: {
                                orderControllerId: orderController?.id,
                                tableId: orderController?.table_id!
                            }
                        })}
                    >
                        Re-print
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}