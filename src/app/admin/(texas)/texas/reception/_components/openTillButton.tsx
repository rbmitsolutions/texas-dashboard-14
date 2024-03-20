'use client'

//components
import { Button } from "@/components/ui/button";

//store
import { usePrintersStore } from "@/store/restaurant/printers";

//hooks
import { usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

export default function OpenTillButton () {
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
                openTill: {
                    ip: defaultPrinter?.ip,
                }
            }
        })
    }

    return (
        <Button
            leftIcon="Euro"
            variant='secondary'
            onClick={handlePrintOrder}
        >
            Open Till
        </Button>
    )
}