import { UseMutateFunction } from "react-query"
import { useState } from "react"
import Image from "next/image"

//libs
import { cn } from "@/common/libs/shadcn/utils"

//components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import ImageCropper from "@/components/common/imageCropper"
import { Button } from "@/components/ui/button"

//interface
import { IPOSTUserBody, IPOSTUserDataRerturn } from "@/hooks/user/IPostUserDataHooks.interface"
import { IFiles, IFilesAs, IFilesType } from "@/common/types/company/files.interface"
import { IToken } from "@/common/types/auth/auth.interface"

interface UploadImportantDocumentProps {
    user: IToken
    docAs: IFilesAs
    uploadFile: UseMutateFunction<IPOSTUserDataRerturn, any, IPOSTUserBody, unknown>
    isLoading: boolean
}

const renderTitle = (docAs: IFilesAs) => {
    switch (docAs) {
        case IFilesAs.USER_PASSPORT:
            return 'Upload your GNIB or PASSPORT'
        case IFilesAs.USER_PPS:
            return 'Upload your PPS'
        case IFilesAs.USER_POA:
            return 'Upload your Proof of Address'
        default:
            return 'document'
    }
}

export default function UploadImportantDocument({ user, docAs, uploadFile, isLoading }: UploadImportantDocumentProps) {
    const [image, setImage] = useState<string>('')

    const onUpload = async (image: any) => {
        setImage(image)
    }

    const onSave = async (image: any) => {
        await uploadFile({
            file: {
                as: docAs,
                file: image,
                key: user.user_id,
                type: IFilesType.IMAGE
            }
        }, {
            onSuccess: (data) => {
                const response: IFiles = data as any
                setImage(response?.secure_url)
            }
        })
    }

    return (
        <Dialog
            open={true}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className='capitalize'>{renderTitle(docAs)}</DialogTitle>
                </DialogHeader>
                <div className='flex-col-container items-center justify-center py-8'>
                    <ImageCropper
                        cropShape="rect"
                        image={image || ''}
                        cropSize={{ width: 250, height: 400 }}
                        onSave={onUpload}
                    >
                        <div className='r-2 w-80 h-40 rounded-lg border-dashed border-2'>
                            <Image
                                alt='important document'
                                src={image || '/img/noimage.jpg'}
                                layout='fill'
                                objectFit='cover'
                                className={cn('rounded-md', !image && 'grayscale opacity-20')}
                            />
                        </div>
                    </ImageCropper>

                    <div className='flex-container justify-center w-full mt-4'>
                        <Button
                            variant='destructive'
                            onClick={() => setImage('')}
                            leftIcon="Trash"
                            disabled={isLoading}
                        >
                            Delete
                        </Button>
                        <Button
                            disabled={!image || isLoading}
                            onClick={() => onSave(image)}
                            leftIcon="Save"
                            className='ml-4'
                            isLoading={isLoading}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}