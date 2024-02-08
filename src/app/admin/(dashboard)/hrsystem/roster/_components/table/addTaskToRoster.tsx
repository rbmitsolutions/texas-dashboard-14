import { UseMutateFunction } from "react-query"
import { useState } from "react";

//libs
import { isUserAuthorized } from "@/common/libs/user/isUserAuthorized";
import Icon from "@/common/libs/lucida-icon";

//components
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

//hooks
import { useAuthHooks } from "@/hooks/useAuthHooks";

//interface
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { Permissions } from "@/common/types/auth/auth.interface";
import { IForm } from "@/common/types/company/form.interface";

interface AddTaskToRosterProps {
    roster_id: string
    forms: IForm[]
    createRosterTask: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
}

export default function AddTaskToRoster({ roster_id, forms, createRosterTask }: AddTaskToRosterProps): JSX.Element {
    const { user } = useAuthHooks()
    const [selected, setSelected] = useState<string>()

    const handleAddTask = async () => {
        if (!selected) return

        const form = forms.find(f => f.id === selected)

        if (!form) return

        await createRosterTask({
            rosterTask: {
                form_id: form?.id,
                form: form?.title,
                created_by: user?.name,
                created_id: user?.user_id,
                roster_id
            }
        }, {
            onSuccess: () => {
                setSelected('')
            }
        })

    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className='h-4 w-4 p-1'
                    disabled={!isUserAuthorized(
                        user?.permissions,
                        [Permissions.ROSTER_TASKS]
                    )}
                >
                    <Icon name="FileCheck" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-[200px]" align="start">
                <Select onValueChange={e => setSelected(e)} value={selected}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Form" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {forms?.map(f => {
                                return (
                                    <SelectItem key={f.id} value={f.id}>{f.title}</SelectItem>
                                )
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    className='mt-4'
                    leftIcon="Plus"
                    type='button'
                    onClick={handleAddTask}
                >Add</Button>
            </PopoverContent>
        </Popover >
    )

}