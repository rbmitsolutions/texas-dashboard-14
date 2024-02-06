import { CreateRosterFormSchemaType } from "@/common/libs/zod/forms/company/companyRosterForm"
import { IPOSTRosterBody } from "@/hooks/company/IPostCompanyDataHooks.interface"
import { IShifts } from "@/common/types/company/companyDetails.interface"
import { parseDate } from "@/common/libs/date-fns/dateFormat"
import { IUser } from "@/common/types/user/user.interface"

interface IGenerateRoster {
    user: IUser
    shift: IShifts
    date: { date: string, day: string }
    formData: CreateRosterFormSchemaType
}
export const generateRoster = ({
    user,
    shift,
    date,
    formData,
}: IGenerateRoster): IPOSTRosterBody => {
    return {
        date: parseDate(date?.date, 'dd/MM/yy'),
        duty: formData?.is_dayoff ? "Day Off" : formData?.duty,
        shift: formData?.is_dayoff ? "Day Off" : shift?.title,
        status: formData?.is_dayoff ? "dayoff" : 'unconfirmed',
        hours: formData?.is_dayoff ? 0 : shift?.hours,
        week_day: date?.day,
        week_payment_preview: formData?.is_dayoff
            ? 0
            : calculateRosterPayment(user, shift, date?.day),

        user_id: user?.id,
        fixed_salary: user?.fixed_salary,
        salary: user?.fixed_salary
            ? Number(user?.salary)!
            : date?.day === "Sun"
                ? Number(user?.rate_per_hour_weekend!)
                : Number(user?.rate_per_hour!),
    };

}


export function calculateRosterPayment(
    user: IUser,
    shift: IShifts,
    day: string
) {
    if (user?.fixed_salary) {
        return Number(user?.salary)!;
    } else {
        return day === "Sun"
            ? Number((shift?.hours * (user?.rate_per_hour_weekend! / 60)).toFixed(2))!
            : Number((shift?.hours * (user?.rate_per_hour! / 60)).toFixed(2))!
    }
}
