import { useEffect, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { ExtendedAddOnsFormType } from "./createUpdateAddOnsForm"
import toast from "react-hot-toast"

interface AddOnsOptionsProps {
    form: ExtendedAddOnsFormType,
}

interface ICreateOption {
    title: string
    value: number
}

const text = (text: string) => {
    return text?.toLowerCase()?.trim()?.replace(/\s/g, '')
}

export default function AddOnsOptions({ form }: AddOnsOptionsProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [options, setOprions] = useState(form.getValues('options') || [])
    const [option, setOption] = useState<ICreateOption>({
        title: '',
        value: 0
    } as ICreateOption)


    const handleAddAddOn = () => {
        if (options?.find(o => text(o?.title) === text(option?.title))) {
            toast.error('Option already exists')
            return
        }

        if (option?.title.trim() === '') {
            toast.error('Title is required')
            return
        }
        form.setValue('options', [...options, {
            title: option?.title,
            value: option?.value 
        }])
        setOption({
            title: '',
            value: 0
        })
        toast.success('Option added')
        inputRef?.current?.focus()

    }

    const handlRemoveOption = (index: number) => {
        form.setValue('options', options?.filter((o, i) => i !== index))
    }

    useEffect(() => {
        setOprions(form.getValues('options') || [])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('options')])

    return (
        <>
            {options?.length > 0 &&
                <div className='flex flex-wrap gap-4'>
                    {options?.map((option, index) => {
                        return (
                            <Badge
                                key={index}
                                className='cursor-pointer hover:bg-red-500'
                                onClick={() => handlRemoveOption(index)}
                            >
                                {option?.title} / {convertCentsToEuro(option?.value) || 0}
                            </Badge>
                        )
                    })}
                </div>
            }

            <Dialog
            >
                <DialogTrigger asChild>
                    <Button
                        className='w-32'
                        variant='outline'
                        leftIcon='ChefHat'
                    >Options</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create</DialogTitle>
                    </DialogHeader>
                    <div className='grid grid-cols-2 items-end gap-4 mt-4'>
                        <FormLabel htmlFor='option'>
                            Title
                            <Input
                                ref={inputRef}
                                id='title'
                                type='text'
                                className='mt-2'
                                placeholder="Barbecue sauce"
                                value={option?.title}
                                onChange={(e) => setOption({ ...option, title: e.target.value })}
                            />
                        </FormLabel>
                        <FormLabel htmlFor='value'>
                            Value
                            <Input
                                id='value'
                                type='number'
                                min={0}
                                step={0.1}
                                className='mt-2'
                                placeholder="on-side"
                                value={String(option?.value / 100)}
                                onChange={e => {
                                    const roundedValue = parseFloat(Number(e.target.value).toFixed(2));
                                    setOption({ ...option, value: roundedValue * 100})
                                }}
                            />
                        </FormLabel>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleAddAddOn}
                            variant='secondary'
                        >
                            Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}