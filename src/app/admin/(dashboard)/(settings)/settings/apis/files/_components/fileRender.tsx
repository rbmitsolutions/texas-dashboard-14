

import Link from "next/link"
import Image from "next/image"

//interface 
import { IFiles } from "@/common/types/company/files.interface"

interface FileRenderProps {
    file: IFiles
}

export default function FileRender({ file }: FileRenderProps) {
    if (file?.type === 'image') {
        return (
            <div className='relative duration-500 transition-all group hover:scale-105'>
                <Image
                    alt={file.title}
                    src={file.url}
                    width={200}
                    height={200}
                    key={file.id}
                    className='w-full h-auto rounded-md cursor-pointer hover:opacity-60'
                />
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
        <div className='relative flex-col-container items-center justify-center bg-background-soft min-h-40 h-full duration-500 transition-all group hover:scale-105'>
            <h1>{file.title}</h1>
            <small>{file?.description}</small>
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