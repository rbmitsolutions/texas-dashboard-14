import { useRef, useState } from "react"
import toast from "react-hot-toast"
import Link from "next/link"

//libs
import Icon from "@/common/libs/lucida-icon"

//components
import { Button } from "@/components/ui/button"

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks"

//interfaces
import { IFiles } from "@/common/types/company/files.interface"

interface FileDownloadButtonProps {
    file?: IFiles
    file_id?: string
}

export default function FileDownloadButton({ file, file_id }: FileDownloadButtonProps) {
    const [fileToDownload, setFileToDownload] = useState<IFiles>(file || {} as IFiles)
    const linkRef = useRef<HTMLAnchorElement>(null)

    useGETCompanyDataHooks({
        query: 'FILES',
        defaultParams: {
            files: {
                byId: {
                    id: file_id!
                }
            }
        },
        UseQueryOptions: {
            onSuccess: (data) => {
                setFileToDownload(data as IFiles)
            },
            onError: () => {
                toast.error('Error fetching file')
            },
            enabled: (file_id && !file) ? true : false
        }
    })

    const onDownload = async () => {
        const link = linkRef.current as HTMLAnchorElement
        link.click()
    };

    return (
        <div className='flex-container items-center'>
            <Link
                ref={linkRef}
                href={fileToDownload?.secure_url || '/'}
                passHref
                target='_blank'
                className="hidden"
                data-testid='file-download-link'
            />
            <Button
                onClick={() => onDownload()}
                size='iconExSm'
                data-testid='file-download-button'
                arial-label='File Download Button'
            >
                <Icon name='FileDown' size={16} />
            </Button>
        </div>
    )
}