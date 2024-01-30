import Icon from "@/common/libs/lucida-icon";
import { convertCentsToEuro } from "@/common/utils/convertToEuro";
import { Button } from "@/components/ui/button";
import { ICreateNewOrder } from "..";

interface OrderDisplayFooterProps {
    order: ICreateNewOrder
}
export default function OrderDisplayFooter({ order }: OrderDisplayFooterProps) {
    return (
        <footer className='flex justify-between border-t-2 h-fit p-2'>
            <div className='flex items-center'>
                <Button size='iconSm' disabled={order?.quantity === 1}>
                    <Icon name='Minus' size={14} />
                </Button>
                <span className='text-center w-8'>{order?.quantity}</span>
                <Button size='iconSm'>
                    <Icon name='Plus' size={14} />
                </Button>
            </div>
            <Button
                className='text-xs'
            >
                {convertCentsToEuro(500.20)}
            </Button>
        </footer>
    )
}