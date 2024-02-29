import { useRef, useState } from "react";
import toast from "react-hot-toast";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SelectUpdateFormType } from "../selectUpdate";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AddNewOptionProps {
    form: SelectUpdateFormType
    onSave: (option: string) => void
    onRemove: (option: string) => void
}

export default function AddNewOption({ form, onSave, onRemove }: AddNewOptionProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [option, setOption] = useState<string>('')

    const handleAddOption = () => {
        const options = form.getValues('options')
        const findOption = options?.find(o => o.toLowerCase().trim() === option.toLowerCase().trim())

        if (findOption) {
            toast.error('Option already exists')
            return
        }

        if (option === '') {
            toast.error('Option cannot be empty')
            return
        }
        onSave(option)
        setOption('')
    }
    
    return (
        <>
            <div>
                <strong className='text-sm'>Options</strong>
                <ul className='list-disc pl-4 max-h-40 overflow-auto scrollbar-thin'>
                    {form.watch('options').map((option: string, index: number) => (
                        <li key={index}
                            className='mt-1'
                        ><Badge className='cursor-pointer hover:bg-red-600' onClick={() => onRemove(option)}>{option}</Badge></li>
                    ))}
                </ul>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className='w-32'
                        variant='outline'
                        leftIcon='PlusCircle'
                    >Options</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create</DialogTitle>
                    </DialogHeader>
                    <FormLabel htmlFor='option'>
                        Title
                        <Input
                            ref={inputRef}
                            id='title'
                            type='text'
                            className='mt-2'
                            placeholder="Barbecue sauce"
                            value={option}
                            onChange={(e) => setOption(e.target.value)}
                        />
                    </FormLabel>
                    <DialogFooter>
                        <Button
                            onClick={handleAddOption}
                            leftIcon="PlusCircle"
                        >
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}