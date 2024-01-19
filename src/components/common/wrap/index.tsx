import Icon from "@/common/libs/lucida-icon";
import { icons } from "lucide-react"
import { cn } from "@/common/libs/shadcn/utils";

//components
import SearchInput, { ISearchInput } from "../searchInput";
import { DatePicker, DatePickerWithRange, IDatePicker, IDatePickerWithRange } from "../datePicker";
import OptionsPopover, { IOptionsPopover } from "../optionsPopover";
import Pagination, { IPagination } from "../pagination";


interface IWrap {
    header?: {
        title?: {
            title: string
            icon: keyof typeof icons
        }
        pagination?: IPagination
    }
    actions?: {
        dateChange?: {
            datePickerWithRange?: IDatePickerWithRange
            datePicker?: IDatePicker
        }
        searchInput?: ISearchInput
        optionsPopover?: IOptionsPopover['options']
        toLeft?: React.ReactNode
        toRight?: React.ReactNode
        className?: string
    }
    footer?: React.ReactNode;
    children: React.ReactNode;
}
export default function Wrap({ header, actions, footer, children }: IWrap) {
    return (
        <section className='flex-col-container gap-4'>
            {header &&
                <header className='flex-container justify-between'>
                    {header?.title &&
                        <div className='flex-container-center gap-2 min-w-40'>
                            <Icon name={header?.title?.icon} size={18}/>
                            <h3 className='text-md'>{header?.title?.title}</h3>
                        </div>
                    }
                    {header?.pagination &&

                        <div className='flex-container w-full justify-end gap-4'>
                            <Pagination {...header.pagination} />
                        </div>
                    }
                </header>
            }
            {actions &&
                <div className={cn('', actions?.className)}>
                    {actions?.toLeft && <div>{actions.toLeft}</div>}
                    {actions?.searchInput && <SearchInput {...actions.searchInput} />}
                    {actions?.dateChange?.datePickerWithRange && <DatePickerWithRange {...actions.dateChange.datePickerWithRange} />}
                    {actions?.dateChange?.datePicker && <DatePicker {...actions.dateChange.datePicker} />}
                    {actions?.optionsPopover && <OptionsPopover options={actions.optionsPopover} />}
                    {actions?.toRight && <div>{actions.toRight}</div>}

                </div>
            }
            <main>
                {children}
            </main>
            {footer &&
                <footer>
                    {footer}
                </footer>
            }
        </section>
    )
}



