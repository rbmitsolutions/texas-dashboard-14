import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { ICompanyLinks } from "@/common/types/company/companyDetails.interface";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/common/libs/lucida-icon";


export default function Links({ link }: { link: ICompanyLinks }) {

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
                <Button size='icon' onClick={() => downloadLink(link)}>
                    <Icon name='Download' size={14} />
                </Button>
            </DialogContent>
        </Dialog>
    )
}