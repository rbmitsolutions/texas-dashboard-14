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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PaymentInputDescription from "./paymentInputDescription"

//libs
import { convertCentsToEuro } from "@/common/utils/convertToEuro"

//interface
import { PayrollTransactionsType } from "@/common/types/company/transactions.interface"
import { IUserExtraPaymentData } from "@/hooks/company/IGetCompanyDataHooks.interface"
import { IPOSTTransaction } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { ImagesPath } from "@/common/types/imgs"
import { ICreateTransaction } from ".."

interface RosterPaymentTableProps {
  users: IUserExtraPaymentData[]
  createTransaction: (data: ICreateTransaction) => IPOSTTransaction
  transactions: IPOSTTransaction[]
}

export function RosterPaymentTable({
  users,
  createTransaction,
  transactions
}: RosterPaymentTableProps): JSX.Element {

  return (
    <Table className='rounded-md border'>
      <TableHeader >
        <TableRow>
          <TableHead className='w-56 py-4'>Employee</TableHead>
          <TableHead className='w-28'>Schedule payment</TableHead>
          <TableHead className='w-28'>Wages By Roster</TableHead>
          {Object.values(PayrollTransactionsType).map(t => {
            return (
              <TableHead
                key={t}
                className='min-w-32 max-w-32 text-center capitalize'
              >{t}</TableHead>
            )
          })}

          <TableHead className='w-24'>Total By Clock In</TableHead>
          <TableHead className='w-24'>Total Paid</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map(user => {
          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className='flex-container items-center'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={user?.profile_image || ImagesPath.NO_IMAGE} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.split('')[0]}
                    </AvatarFallback>
                  </Avatar>
                  {user?.name}
                </div>
              </TableCell>

              <TableCell>
                {convertCentsToEuro(user?.preview_roster * 100)}
              </TableCell>

              <TableCell>
                {convertCentsToEuro(user?.total_roster * 100)}
              </TableCell>

              {Object.values(PayrollTransactionsType).map(type => {
                return (
                  <TableCell key={type}>
                    <PaymentInputDescription
                      type={type}
                      user={user}
                      createTransaction={createTransaction}
                      transactions={transactions}
                    />
                  </TableCell>
                )
              })}
              <TableCell>
                {convertCentsToEuro(user?.total_roster * 100)}
              </TableCell>
              <TableCell>
                {convertCentsToEuro(
                  user?.transactions?.reduce((a, b) => a + b.total, 0) || 0
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
