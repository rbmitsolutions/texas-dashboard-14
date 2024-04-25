//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { formatDate } from "@/common/libs/date-fns/dateFormat"
import { cn } from "@/common/libs/shadcn/utils"

//components
import { IStockItem } from "@/common/types/restaurant/stock.interface"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import LinkButton from "@/components/common/linkButton"

//interface
import { RedirectTo } from "@/common/types/routers/endPoints.types"

export interface ItemDescriptionDialogProps {
    item: IStockItem
}

export default function ItemDescriptionDialog({ item }: ItemDescriptionDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>

                <Button
                    leftIcon="Info"
                    size='sm'
                    variant='outline'
                >
                    {item?.title}
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{item?.title}</DialogTitle>
                </DialogHeader>
                <div className='flex-col-container'>
                    <div className='flex-container justify-between'>
                        <small>{item?.title}</small>
                        <LinkButton
                            href={RedirectTo.ITEM_PROFILE + '/' + item?.id}
                        />
                    </div>
                    <strong className={cn('flex-container items-center gap-1', item?.stock < item?.min_stock && 'text-red-500')}>
                        Stock: {item?.stock > 0 ? (item?.stock / item?.volume).toFixed(0) : item?.stock}
                    </strong>
                    <small>Min. Stock: {item?.min_stock}</small>
                    <small>Max. Stock: {item?.max_stock}</small>
                    <small>Last Order Date:  {item?.last_order_date && formatDate({
                        date: item?.last_order_date,
                        f: 'dd/MM/yyyy'
                    })}</small>
                    <small>Last Order Unit Price: {convertCentsToEuro(item?.volume * (item?.last_order_one_vol_price || 0))}</small>
                </div>
            </DialogContent>
        </Dialog>
    )
}