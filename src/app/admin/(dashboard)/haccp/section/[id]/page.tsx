'use server'
import { getFormSections } from "@/common/libs/company/actions/formsSections"
import { IFormSection } from "@/common/types/company/form.interface"
import Link from "next/link"

export default async function SectionPage(params: { params: { id: string } }) {
    const formSection = await getFormSections({
        byId: {
            id: params.params.id,
            include: {
                form: '1'
            }
        }
    }) as IFormSection

    return (
        <div className=''>
            <h1 className='text-3xl text-center mt-8 capitalize'>{formSection?.title?.toLowerCase()}</h1>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 max-w-xl m-auto mt-8'>
                {formSection?.forms?.map(form => {
                    return (
                        <Link
                            key={form?.id}
                            className='flex-container-center justify-center p-4 border-2 bg-background-soft rounded-2xl cursor-pointer hover:bg-primary/5 text-center h-40'
                            href={`/admin/haccp/${form?.id}`}
                        >
                            <strong className='capitalize'>
                                {form?.title.toLowerCase()}
                            </strong>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}