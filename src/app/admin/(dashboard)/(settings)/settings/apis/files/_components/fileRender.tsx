import { UseMutateFunction } from "react-query"

import Link from "next/link"
import Image from "next/image"

//interface 
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface"
import { IFiles } from "@/common/types/company/files.interface"
import { DeleteDialogButton } from "@/components/common/deleteDialogButton"

interface FileRenderProps {
    file: IFiles
    deleteFile: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function FileRender({ file, deleteFile }: FileRenderProps) {
    if (file?.type === 'image') {
        return (
            <div className='relative duration-500 transition-all group bg-background-soft hover:scale-105'>
                <Image
                    alt={file.title}
                    src={file.url}
                    width={200}
                    height={200}
                    key={file.id}
                    className='w-full h-auto rounded-md cursor-pointer hover:opacity-60'
                />
                <div className='absolute invisible capitalize top-2 right-2 group-hover:visible'>
                    <DeleteDialogButton 
                        onDelete={ async () => await deleteFile({
                            file: {
                                id: file.id
                            }
                        })}
                    />
                </div>
                <Link
                    href={file.url}
                    target='_blank'
                    rel='noreferrer'
                    className='absolute invisible capitalize bottom-0 left-0 right-0 bg-gray-800 text-white text-center p-1 rounded-b-md group-hover:visible'
                >
                    {file.title.toLowerCase()}
                </Link>
            </div>
        )
    }

    return (
        <div className='relative flex-col-container items-center justify-center p-4 bg-background-soft min-h-40 h-full duration-500 transition-all group hover:scale-105'>
            <h1 className='break-all'>{file.title}</h1>
            <small className='break-all'>{file?.description}</small>
            <div className='absolute invisible capitalize top-2 right-2 group-hover:visible'>
                    <DeleteDialogButton 
                        onDelete={ async () => await deleteFile({
                            file: {
                                id: file.id
                            }
                        })}
                    />
                </div>
            <Link
                href={file.url}
                target='_blank'
                rel='noreferrer'
                className='absolute invisible capitalize bottom-0 left-0 right-0 bg-gray-800 text-white text-center p-1 rounded-b-md group-hover:visible'
            >
                {file.title.toLowerCase()}
            </Link>
        </div >
    )
}