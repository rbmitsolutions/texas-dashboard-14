import { UseMutateFunction } from "react-query";
import { useState } from "react";

//components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

//interfaces
import { IPOSTCompanyBody, IPOSTCompanyDataRerturn } from "@/hooks/company/IPostCompanyDataHooks.interface";
import { Input } from "@/components/ui/input";


interface CreateDepartamentFormProps {
    createDepartament: UseMutateFunction<IPOSTCompanyDataRerturn, any, IPOSTCompanyBody, unknown>
    isLoading: boolean
}

export default function CreateDepartamentForm({ createDepartament, isLoading }: CreateDepartamentFormProps) {
    const [title, setTitle] = useState('')

    const onSubmitForm = async () => {
        await createDepartament({
            departament: {
                title
            }
        }, {
            onSuccess: () => {
                setTitle('')
            }
        })

    };


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    leftIcon="Plus"
                    size='sm'
                    variant='orange'
                >
                    Section
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex-col-container w-auto" align="start">
                <Input 
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Button
                    onClick={onSubmitForm}
                    leftIcon="Plus"
                    size='sm'
                    disabled={isLoading || !title}
                >
                    Create
                </Button>
            </PopoverContent>
        </Popover>
    )
}