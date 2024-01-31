"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import Wrap from "@/components/common/wrap"
import { IDepartaments } from "@/common/types/company/departaments.interface"
import SendEmail from "@/components/common/sendEmail"
import { IUser } from "@/common/types/user/user.interface"

interface UserTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  departament: IDepartaments
}

export function UserTable<TData, TValue>({
  columns,
  data,
  departament
}: UserTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
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
        optionsPopover: {
          isLoading: !departament,
          options: [{
            label: 'Role',
            placeholder: 'Role',
            options: [
              {
                label: 'All',
                value: 'all'
              },
              ...departament?.roles?.map(r => {
                return {
                  label: r.title,
                  value: r.id
                }
              }),

            ],
            value: table.getColumn("role_id")?.getFilterValue() as string,
            onChange: (e) => table.getColumn("role_id")?.setFilterValue(e == 'all' ? null : e),
          }]
        },
        toRight: (
          <div>
            <SendEmail
              contacts={usersSelected?.map(u => {
                return {
                  id: u?.id,
                  name: u?.name,
                  email: u?.email
                }
              })}
            />
          </div>
        ),
        className: 'grid grid-cols-[1fr,auto,40px] gap-4 items-center',
      }}
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
