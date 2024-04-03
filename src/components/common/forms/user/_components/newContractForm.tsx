import { useState } from "react";

//components
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { IUser } from "@/common/types/user/user.interface";
import FileDownload from "@/components/common/fileDownload";

interface NewContractFormProps {
    user: IUser
}

export default function NewContractForm({ user }: NewContractFormProps) {
    const [isOpen, setIsOpen] = useState(false)

    const {
        companyAllFiles: files,
        refetchCompanyData: refetchFiles
    } = useGETCompanyDataHooks({
        query: 'FILES',
        defaultParams: {
            files: {
                all: {
                    in: {
                        key: [user?.id],
                    },
                    as: {
                        in: ['contract', 'contract-filed', 'contract-sgined']
                    },
                    pagination: {
                        take: 10,
                        skip: 0
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: isOpen
        }
    })


    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
        >
            <DialogTrigger asChild>
                <Button
                    variant='orange'
                    leftIcon="FileDown"
                >
                    Contract
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Contracts</DialogTitle>
                </DialogHeader>
                <div>
                    {files?.data?.map(file => {
                        return (
                            <FileDownload
                                file={file}
                                key={file.id}
                                onDelete={refetchFiles}
                            />
                        )
                    })}
                </div>
                
                {/* <DialogFooter>
                    <Button
                        // onClick={handleAddOption}
                        leftIcon="PlusCircle"
                    >
                        Close
                    </Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}