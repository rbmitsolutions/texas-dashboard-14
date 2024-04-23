//libs
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
import { convertIfValueIsDate, formatDate } from "@/common/libs/date-fns/dateFormat"
import { convertCentsToEuro } from "@/common/utils/convertToEuro"
import { IFormData } from "@/common/types/company/form.interface"
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"
import { useState } from "react"
import Icon from "@/common/libs/lucida-icon"

export interface FormDataDialogProps {
    formDataId?: string
}

export default function FormDataDialog({ formDataId }: FormDataDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const {
        companyFormData: formData
    } = useGETCompanyDataHooks({
        query: 'FORM_DATA',
        defaultParams: {
            formData: {
                byId: {
                    id: formDataId!,
                }
            }
        },
        UseQueryOptions: {
            enabled: !!formDataId && isOpen
        }
    })


    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button
                    size='iconExSm'
                    variant='pink'
                    disabled={!formDataId}
                >
                    <Icon name='FileArchive' />
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{formData?.title}</DialogTitle>
                </DialogHeader>
                <div className='max-h-80 overflow-auto pr-2 scrollbar-thin'>
                    {formData?.values?.map((array, index) => {
                        return (
                            <div key={index} className='flex-col-container'>
                                {array?.map((input: any) => {
                                    return (
                                        <div key={input?.register} className='flex flex-col border-r-2 pr-4 min-w-24 bg-background-soft p-2' >
                                            <small className='font-bold text-primary/85'>{input?.label}</small>
                                            <small>{convertIfValueIsDate(input?.propsUi?.value?.toString())}</small>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}