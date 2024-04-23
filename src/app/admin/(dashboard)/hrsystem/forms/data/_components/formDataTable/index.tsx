"use client"

//components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { convertIfValueIsDate, formatDate } from "@/common/libs/date-fns/dateFormat"
import { IFormData } from "@/common/types/company/form.interface"

interface FormDataTableProps<TData, TValue> {
    data: IFormData[]
    isFetching: boolean
}

export function FormDataTable<TData, TValue>({
    data,
    isFetching
}: FormDataTableProps<TData, TValue>) {

    if (isFetching) return <FormDataTable.Skeleton />

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-40'>Info</TableHead>
                        <TableHead>Data</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map(form => {
                        return (
                            <TableRow key={form.id}>
                                <TableCell className='min-w-40'>
                                    <div className='flex flex-col'>
                                        <small>{formatDate({
                                            date: new Date(form?.created_at)
                                        })}</small>
                                        <small className='font-bold'>{form?.title}</small>
                                        <small>{form?.by}</small>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-wrap gap-8 py-2'>
                                        {form?.values?.map((array, index) => {
                                            return (
                                                <div key={index} className='flex gap-4 '>
                                                    {array?.map((input: any) => {
                                                        return (
                                                            <div key={input?.register} className='flex flex-col border-r-2 pr-4 min-w-24' >
                                                                <small className='font-bold text-primary/85'>{input?.label}</small>
                                                                <small>{convertIfValueIsDate(input?.propsUi?.value?.toString())}</small>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}


FormDataTable.Skeleton = function SignInformSkeleton() {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-40'>Info</TableHead>
                    <TableHead className='w-full'>Data</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(10)].map((_, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell className='min-w-40'>
                                <div className='flex flex-col'>
                                    <Skeleton className='w-full h-8' />
                                </div>
                            </TableCell>
                            <TableCell className='min-w-40'>
                                <div className='flex flex-col'>
                                    <Skeleton className='w-full h-8' />
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody >
        </Table >
    )
}
