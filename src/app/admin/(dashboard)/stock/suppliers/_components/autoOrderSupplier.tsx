import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

//interfaces
import { IStockSupplierAutoOrder } from "@/common/types/restaurant/stock.interface";
import Icon from "@/common/libs/lucida-icon";

interface AutoOrderSupplierProps {
    auto_order?: IStockSupplierAutoOrder
}

export default function AutoOrderSupplier({ auto_order }: AutoOrderSupplierProps) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size='iconSm'
                    variant={auto_order ? 'green' : 'destructive'}
                >
                    <Icon
                        name={auto_order ? 'Pen' : 'Plus'}
                    />
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>Create</DialogTitle>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}