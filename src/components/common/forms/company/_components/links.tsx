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

//interfaces
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";
import { ICompanyLinks } from "@/common/types/company/companyDetails.interface";

export default function Links({ link, deleteLink }: { link: ICompanyLinks, deleteLink?: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown> }) {

    const downloadLink = (Links: ICompanyLinks) => {
        window.open(link?.link, '_blank')
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='flex justify-start text-wrap text-left text-xs h-14'>
                    <Icon name='Mouse' className='mr-2' size={14} />
                    {link?.title}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{link?.title}</DialogTitle>
                </DialogHeader>
                <div className='space-y-2 text-sm'>
                    <label>Name</label>
                    <Input type="text" value={link?.title} />
                </div>
                <div className='space-y-2 text-sm'>
                    <label>Description</label>
                    <Textarea className='min-h-40' value={link?.description} />
                </div>
                <div className='flex-container justify-end'>
                    <Button size='icon' onClick={() => downloadLink(link)}>
                        <Icon name='Mouse' size={14} />
                    </Button>
                    {deleteLink &&
                        <Button
                            size='icon'
                            variant='destructive'
                            onClick={() => deleteLink({
                                link: {
                                    id: link?.id
                                }
                            })}>
                            <Icon name='Trash' size={14} />
                        </Button>}
                </div>
            </DialogContent>
        </Dialog>
    )
}