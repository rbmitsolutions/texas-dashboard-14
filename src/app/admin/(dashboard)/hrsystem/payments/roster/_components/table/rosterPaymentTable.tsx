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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { Button } from "@/components/ui/button"

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
          <TableHead className='w-24'>Schedule payment</TableHead>
          <TableHead className='w-24'>Wages By Roster</TableHead>
          {Object.values(PayrollTransactionsType).map(t => {
            return (
              <TableHead
                key={t}
                className='min-w-32 max-w-32 text-center capitalize'
              >{t}</TableHead>
            )
          })}
          <TableHead className='w-24'>Total To Pay</TableHead>

          <TableHead className='w-24'>Total By Clock In</TableHead>
          <TableHead className='w-24'>Total Paid</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map(user => {
          const userTransactionsTotal = transactions?.filter(t => t.payee_key === user.id).reduce((acc, t) => {
            acc += t.total
            return acc
          }, 0)

          const userPaidTotal = user?.transactions?.reduce((a, b) => a + b.total, 0) || 0
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
              <TableCell className={userTransactionsTotal > 0 ? 'text-green-600 dark:text-green-500' : ''}>
                {convertCentsToEuro(userTransactionsTotal)}
              </TableCell>
              <TableCell className={user?.total_roster > 0 ? 'text-yellow-600 dark:text-yellow-500' : ''}>
                {convertCentsToEuro(user?.total_roster * 100)}
              </TableCell>
              <TableCell className={userPaidTotal > 0 ? 'text-red-600 dark:text-red-500' : ''}>

                {userPaidTotal > 0 ?
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className='p-2 w-full'
                        variant='outline'
                      >
                        {convertCentsToEuro(
                          userPaidTotal || 0
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-4" align="end">
                      <div className='flex-col-container gap-2 w-56'>
                        {user?.transactions?.map(t => {
                          return (
                            <div key={t.id} className='flex-container justify-between gap-4 border-b-2 pb-2'>
                              <span className='capitalize'>{t.type}</span>
                              <span>{convertCentsToEuro(t.total)}</span>
                            </div>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>


                  :
                  <>
                    {convertCentsToEuro(
                      0
                    )}
                  </>
                }
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
