import { UseMutateFunction } from "react-query"

//components
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

//interface
import { IPUTUserBody } from "@/hooks/user/IPutUserDataHooks.interface"
import { IRoles } from "@/common/types/company/companyDetails.interface"
import { IUser } from "@/common/types/user/user.interface"
import { useState } from "react"

interface UpdateRoleFormProps {
    user: IUser
    onUpdate: UseMutateFunction<any, any, IPUTUserBody, unknown>
    roles: IRoles[]
}

export default function UpdateRoleForm({ user, onUpdate, roles }: UpdateRoleFormProps) {
    const [roleId, setRoleId] = useState<string>('')

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault()
        await onUpdate({
            details: {
                id: user?.id,
                role_id: roleId
            }
        }, {
            onSuccess: () => {
                setRoleId('')
            }
        })

    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    leftIcon='FileBadge2'
                >Change Role</Button>
            </PopoverTrigger>
            <PopoverContent className="w-52">
                <form 
                className='flex-col-container'
                onSubmit={e => handleUpdateRole(e)}
                >
                    <Select
                        value={roleId}
                        onValueChange={(e) => setRoleId(e)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Role</SelectLabel>
                                {roles?.map(r => {
                                    return <SelectItem
                                        key={r?.id}
                                        value={r?.id}
                                    >
                                        {r?.title}
                                    </SelectItem>
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        type='submit'
                        leftIcon="Save"
                    >
                        Update
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    )
}