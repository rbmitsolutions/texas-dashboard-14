'use client'

import { cn } from "@/common/libs/shadcn/utils"
//interface
import { IForm, IFormSection } from "@/common/types/company/form.interface"
import Link from "next/link"

interface HaacpContainerProps {
    forms: IForm[]
    formsSections: IFormSection[]
}

const styles = {
    container: 'flex-container-center justify-center p-4 border-2 bg-background-soft rounded-2xl cursor-pointer hover:bg-primary/5 text-center h-40'
}

export default function HaccpContainer({ forms, formsSections }: HaacpContainerProps): JSX.Element {
    return (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 max-w-xl m-auto mt-4 md:mt-12'>
            {forms?.map(form => {
                if (!form?.form_section_id) {
                    return (
                        <Link
                            key={form?.id}
                            className={styles?.container}
                            href={`/admin/haccp/${form?.id}`}
                        >
                            <strong className='capitalize'>
                                {form?.title.toLowerCase()}
                            </strong>
                        </Link>
                    )
                }
            })}
            {
                formsSections?.map(section => {
                    if (section?.forms?.length > 0) {
                        return (
                            <Link
                                key={section?.id}
                                className={cn(styles?.container, 'bg-primary/20 hover:bg-primary/15')}
                                href={`/admin/haccp/section/${section?.id}`}
                            >
                                <strong className='capitalize'> {section?.title.toLowerCase()}</strong>
                            </Link>
                        )
                    }
                })
            }

        </div>
    )
}