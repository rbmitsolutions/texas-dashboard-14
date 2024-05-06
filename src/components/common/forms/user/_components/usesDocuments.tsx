'use client'
import Link from "next/link";

//components
import FileRender from "@/app/admin/(dashboard)/(settings)/settings/apis/files/_components/fileRender";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETECompanyDataHooks, useGETCompanyDataHooks } from "@/hooks/company/companyDataHooks";

//interface
import { IUser } from "@/common/types/user/user.interface";

interface UserDocumentsProps {
    user: IUser
}

export default function UserDocuments({ user }: UserDocumentsProps) {

    const {
        companyAllFiles: files,
        setGETCompanyDataParams: setFilesParams,
        GETCompanyDataParams: filesParams,
        refetchCompanyData: toRefetch
    } = useGETCompanyDataHooks({
        query: 'FILES',
        defaultParams: {
            files: {
                all: {
                    key: user?.id,
                    pagination: {
                        skip: 0,
                        take: 40
                    }
                }
            }
        },
        UseQueryOptions: {
            enabled: !!user?.id
        }
    })

    const {
        deleteCompanyData: deleteFile
    } = useDELETECompanyDataHooks({
        query: 'FILES',
        toRefetch
    })

    return (
        <Wrap
            className="border-2 rounded-lg p-4"
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
        >
            <div
                className='w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] items-start justify-start gap-4 space-y-2 p-2'
            >
                {files?.data?.map(file => {
                    return <FileRender file={file} key={file.id} deleteFile={deleteFile}/>
                })}
            </div>
        </Wrap>
    )
}