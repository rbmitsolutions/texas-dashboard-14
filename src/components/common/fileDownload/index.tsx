import toast from "react-hot-toast";

//libs
import { formatDate } from "@/common/libs/date-fns/dateFormat";
import { api } from "@/common/libs/axios/api";
import Icon from "@/common/libs/lucida-icon";

//components
import { DeleteDialogButton } from "../deleteDialogButton";
import { Button } from "@/components/ui/button";

//hooks
import { useDELETECompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interfaces
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";
import { IFiles } from "@/common/types/company/files.interface"

interface FileDownloadProps {
    file: IFiles
    onDelete: () => void
}

export default function FileDownload({ file, onDelete }: FileDownloadProps) {
    const onDownload = async (file_id: string) => {
        try {
            const { data } = await api.get<IFiles>(EndPointsTypes.COMPANY_FILES_ENDPOINT, {
                params: {
                    files: {
                        byId: {
                            id: file_id
                        }
                    }
                }
            })

            const link = document.createElement('a')
            link.href = data.url
            link.download = data.title
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)


        } catch (err) {
            toast.error('File not found!')
        }
    };

    const {
        deleteCompanyData: deleteFile
    } = useDELETECompanyDataHooks({
        query: 'FILES',
        toRefetch: onDelete
    })


    return (
        <div className='flex-container justify-between border-2 p-2 rounded-xl cursor-pointer hover:bg-background-soft'>
            <div className='flex-col-container gap-1'>
                <strong>{file?.title}</strong>
                <small>
                    {formatDate({
                        date: file?.created_at,
                        f: 'dd/MM/yyyy'
                    })}
                </small>
            </div>
            <div className='flex-container items-center'>
                <Button
                    onClick={() => onDownload(file?.id)}
                    size='iconExSm'
                >
                    <Icon name='FileDown' size={16} />
                </Button>
                <DeleteDialogButton
                    onDelete={async () => deleteFile({
                        file: {
                            id: file.id
                        }
                    })}
                />
            </div>
        </div>
    )
}