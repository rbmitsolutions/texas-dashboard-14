"use client"
import { Dispatch, SetStateAction, useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

//libs
import { addDaysToDate } from "@/common/libs/date-fns/dateFormat"

//components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SendEmail from "@/components/common/sendEmail"
import SendSms from "@/components/common/sendSms"
import Wrap from "@/components/common/wrap"

//interfaces
import { IDepartments } from "@/common/types/company/departaments.interface"
import { IGETUserDataQuery } from "@/hooks/user/IGetUserDataHooks.interface"
import { IUser } from "@/common/types/user/user.interface"

interface DayRosterTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  departament: IDepartments
  setUsers: Dispatch<SetStateAction<IGETUserDataQuery>>
  userParams: IGETUserDataQuery
}

export function DayRosterTable<TData, TValue>({
  columns,
  data,
  departament,
  setUsers,
  userParams
}: DayRosterTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })


  const usersSelected: IUser[] = table.getSelectedRowModel().rows.map(r => r.original) as IUser[]

  return (
    <Wrap
      key={departament.id}
      header={{
        title: {
          title: departament?.title,
          icon: "Users"
        }
      }}
      actions={{
        searchInput: {
          onSearchChange: (e) => table.getColumn("name")?.setFilterValue(e),
          placeholder: "Search by name...",
          value: table.getColumn("name")?.getFilterValue() as string,
          debounceDelay: 0,
          custom: 'max-w-sm relative'
        },
        dateChange: {
          datePicker: {
            onConfirm: (date) => {
              setUsers(prev => ({
                user: {
                  all: {
                    ...prev?.user?.all,
                    include: {
                      ...prev?.user?.all?.include,
                      roster: {
                        available: '1',
                        gte: new Date(date || new Date()),
                        lte: new Date(date || new Date())
                      }
                    }
                  }
                }
              }))
            },
            value: userParams?.user?.all?.include?.roster?.gte || new Date(),
            toDate: addDaysToDate(new Date(), 30)
          }
        },
        toRight: (
          <div className='flex gap-2'>
            <SendEmail
              contacts={usersSelected?.map(u => {
                return {
                  id: u?.id,
                  name: u?.name,
                  email: u?.email
                }
              })}
            />
            <SendSms
              contacts={usersSelected?.map(u => {
                return {
                  id: u?.id,
                  name: u?.name,
                  contact_number: u?.contact_number || ''
                }
              }).filter(u => u.contact_number)}
            />
          </div>
        ),
        className: 'grid grid-cols-[1fr,auto,auto] gap-2 items-center',
      }}
      className='mt-6'
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} style={{ width: header?.getSize(), minWidth: header?.getSize() }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Wrap>
  )
}
