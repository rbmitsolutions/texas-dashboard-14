import { useState } from "react";
import { UseMutateFunction } from "react-query";

//components
import Document from "./_components/document";
import Wrap from "../../wrap";

//interface
import { IDELETECompanyDataBody } from "@/hooks/company/IDeleteCompanyDataHooks.interface";
import { IFiles } from "@/common/types/company/files.interface";

interface CompanyDocumentsFormProps {
    documents:  IFiles[]
    deleteDocument?: UseMutateFunction<void, any, IDELETECompanyDataBody, unknown>
}

export default function CompanyDocumentsForm({ documents, deleteDocument }: CompanyDocumentsFormProps) {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'FileText',
                    title: 'Documents'
                }
            }}
            className="border-2 p-4 rounded-xl"
        >
            <div
                className='grid grid-cols-1 gap-4 border-2 p-4 rounded-xl  md:grid-cols-2 lg:grid-cols-4'
            >
                {documents?.map(document => {
                    return <Document key={document?.id} document={document} deleteDocument={deleteDocument}/>
                })}
            </div>
        </Wrap>
    )
}
