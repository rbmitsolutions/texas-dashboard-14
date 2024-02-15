import { UseMutateFunction } from "react-query";

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/common/libs/lucida-icon";

//interface
import { ICompanyDocuments } from "@/common/types/company/companyDetails.interface";
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";


export default function Document({ document, deleteDocument }: { document: ICompanyDocuments, deleteDocument?: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown> }) {

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
                <div className='flex-container justify-end'>
                    <Button size='icon' onClick={() => downloadDocument(document)}>
                        <Icon name='Download' size={14} />
                    </Button>
                    {deleteDocument &&
                        <Button 
                        size='icon' 
                        variant='destructive'
                        onClick={async () => await deleteDocument({
                            document: {
                                file_id: document?.id
                            }

                        })}>
                            <Icon name='Trash' size={14} />
                        </Button>
                    }

                </div>
            </DialogContent>
        </Dialog>
    )
}