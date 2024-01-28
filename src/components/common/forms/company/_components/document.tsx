import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { ICompanyDocuments } from "@/common/types/company/companyDetails.interface";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/common/libs/lucida-icon";


export default function Document({ document }: { document: ICompanyDocuments }) {

    const downloadDocument = (document: ICompanyDocuments) => {
        window.open(document?.url, '_blank')
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='flex justify-start text-wrap text-left text-xs h-14'>
                    <Icon name='FileText' className='mr-2' size={14} />
                    {document?.title}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{document?.title}</DialogTitle>
                </DialogHeader>
                <div className='space-y-2 text-sm'>
                    <label>Name</label>
                    <Input type="text" value={document?.title} />
                </div>
                <div className='space-y-2 text-sm'>
                    <label>Description</label>
                    <Textarea className='min-h-40' value={document?.description} />
                </div>
                <Button size='icon' onClick={() => downloadDocument(document)}>
                    <Icon name='Download' size={14} />
                </Button>
            </DialogContent>
        </Dialog>
    )
}