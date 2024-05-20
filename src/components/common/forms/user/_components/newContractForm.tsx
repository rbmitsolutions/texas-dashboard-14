import { useState } from "react";

//interfaces

//components
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import HireForm from "@/app/admin/(dashboard)/hrsystem/employees/hire/_components/hireForm";
import { DeleteDialogButton } from "@/components/common/deleteDialogButton";
import FileDownloadButton from "@/components/common/fileDownloadButton";
import { Button } from "@/components/ui/button";

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { IRoles } from "@/common/types/company/companyDetails.interface";
import { IUser } from "@/common/types/user/user.interface";
import { IFilesAs } from "@/common/types/company/files.interface";

interface NewContractFormProps {
    user: IUser
    roles: IRoles[]
}

export default function NewContractForm({ user, roles }: NewContractFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isHireFormOpen, setIsHireFormOpen] = useState(false)
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
                        in: [IFilesAs.CONTRACT, IFilesAs.CONTRACT_FILED, IFilesAs.CONTRACT_SIGNED]
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

    const {
        deleteCompanyData: deleteFile
    } = useDELETECompanyDataHooks({
        query: 'FILES',
        toRefetch: refetchFiles
    })

    const onOpenChange = () => {
        setIsOpen(prev => !prev)
        setIsHireFormOpen(false)
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChange}
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
                <div className='flex-col-container overflow-auto max-h-[80vh]'>
                    {isHireFormOpen ?
                        <HireForm
                            roles={roles}
                            user={user}
                        />
                        :
                        <>

                            {files?.data?.length === 0 && 'No contracts'}
                            {files?.data?.map(file => {
                                return (
                                    <div
                                        key={file.id}
                                        className='flex-container justify-between border-2 p-2 rounded-xl cursor-pointer hover:bg-background-soft'>
                                        <div className='flex-col-container gap-1'>
                                            <strong>{file?.title}</strong>
                                        </div>
                                        <div className='flex-container items-center'>
                                            <FileDownloadButton
                                                file={file}
                                            />
                                            <DeleteDialogButton
                                                onDelete={async () => deleteFile({
                                                    file: {
                                                        id: file?.id
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    }
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => setIsHireFormOpen(prev => !prev)}
                        leftIcon="PlusCircle"
                        variant={isHireFormOpen ? 'destructive' : 'purple'}
                    >
                        {isHireFormOpen ? 'Cancel' : 'New Contract'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}