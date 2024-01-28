import Icon from "@/common/libs/lucida-icon"
import { icons } from "lucide-react"

interface ConTextProps {
    icon: keyof typeof icons
    text: string | number
}
export default function IconText({ icon, text }: ConTextProps) {
    return (
        <div className='flex gap-2'>
            <Icon name={icon} size={18}/>
            <p className='text-sm'>{text}</p>
        </div>
    )
}