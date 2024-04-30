'use client'
import Link from "next/link";

//components
import FileRender from "./_components/fileRender";
import Wrap from "@/components/common/wrap";

//hooks
import { useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";
import { IFilesAs } from "@/common/types/company/files.interface";

export default function Images() {
    const {
        companyAllFiles: files,
        setGETCompanyDataParams: setFilesParams,
        GETCompanyDataParams: filesParams,
        isCompanyDataFetching: isFilesFetching
    } = useGETCompanyDataHooks({
        query: 'FILES',
        defaultParams: {
            files: {
                all: {
                    pagination: {
                        skip: 0,
                        take: 40
                    },

                }
            }
        },
    })

    const filesOptions = Object.values(IFilesAs).map(as => ({
        label: as,
        value: as
    })) as { label: string, value: string }[] || []

    return (
        <div>
            <div
                className='flex-col-container gap-2 items-center justify-center py-14'
            >
                <h1 className='font-bold text-4xl'>Cloudinary</h1>
                <Link href='https://cloudinary.com/' className='text-blue-600'
                    target='_blank' rel='noreferrer'
                >https://cloudinary.com/</Link>
            </div>
            <Wrap
                header={{
                    title: {
                        icon: 'FileImage',
                        title: 'Files'
                    },
                    pagination: {
                        onPageChange: (pagination) => setFilesParams(prev => ({
                            files: {
                                all: {
                                    ...prev?.files?.all,
                                    pagination
                                }
                            }
                        })),
                        pagination: files?.pagination,
                        queryPagination: filesParams?.files?.all?.pagination!,
                    }
                }}
                actions={{
                    optionsPopover: {
                        isLoading: isFilesFetching,
                        options: [{
                            label: 'File Type',
                            placeholder: 'Role',
                            options: [
                                {
                                    label: 'All',
                                    value: 'all'
                                },
                                ...filesOptions,
                            ],
                            value: filesParams?.files?.all?.as?.in && filesParams?.files?.all?.as?.in[0] || 'all',
                            onChange: (e) => setFilesParams(prev => ({
                                files: {
                                    all: {
                                        ...prev?.files?.all,
                                        as: {
                                            in: e === 'all' ? [] : [e as any]
                                        },
                                        pagination: {
                                            take: 40,
                                            skip: 0
                                        },

                                    }
                                }
                            })),
                        }]
                    },
                    className: 'flex justify-end gap-4 items-center',
                }}
            >
                <div
                    className='w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] items-start justify-start gap-4 space-y-2'
                >
                    {files?.data?.map(file => {
                        return <FileRender file={file} key={file.id} />
                    })}
                </div>
            </Wrap>

        </div>
    )
}