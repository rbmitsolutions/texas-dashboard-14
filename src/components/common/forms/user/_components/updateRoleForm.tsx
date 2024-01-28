import { IRoles } from "@/common/types/company/companyDetails.interface"
import { IUser } from "@/common/types/user/user.interface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface"
import { UseMutateFunction } from "react-query"

interface UpdateRoleFormProps {
    user: IUser
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
    roles: IRoles[]
}

export default function UpdateRoleForm({ user, onUpdate, roles }: UpdateRoleFormProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className='flex justify-start'
                    leftIcon='KeySquare'
                >Change Role</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                
            </PopoverContent>
        </Popover>
    )
}