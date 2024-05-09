'use client'
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';

import Icon from "@/common/libs/lucida-icon";
import { icons } from "lucide-react"
import { cn } from "@/common/libs/shadcn/utils";

//components
import SearchInput, { SearchInputProps } from "../searchInput";
import { DatePicker, DatePickerWithRange, IDatePicker, DatePickerWithRangeProps } from "../datePicker";
import OptionsPopover, { OptionsPopoverProps } from "../optionsPopover";
import Pagination, { PaginationProps } from "../pagination";
import { Button } from '@/components/ui/button';

interface IWrap {
    header?: {
        title?: {
            title: string
            icon: keyof typeof icons
        }
        screenShot?: boolean
        pagination?: PaginationProps
    }
    actions?: {
        dateChange?: {
            datePickerWithRange?: DatePickerWithRangeProps
            datePicker?: IDatePicker
        }
        searchInput?: SearchInputProps
        optionsPopover?: OptionsPopoverProps
        toLeft?: React.ReactNode
        toRight?: React.ReactNode
        className?: string
    }
    footer?: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    error?: boolean
    children: React.ReactNode;
}
export default function Wrap({ header, actions, footer, error = false, isLoading = false, className, children }: IWrap) {
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: header?.title?.title || "Document",
        removeAfterPrint: true,
    });


    return (
        <section className={cn('flex-col-container gap-4', className)}>
            {header &&
                <header className='flex-col-container justify-between items-center sm:flex-row'>
                    {header?.title &&
                        <div className='flex-container-center gap-2 min-w-40'>
                            <Icon name={header?.title?.icon} size={18} className='text-primary' />
                            <h3 className='text-md capitalize'>{header?.title?.title?.toLowerCase()}</h3>
                            {header?.screenShot &&
                                <>
                                    <Button
                                        size='iconExSm'
                                        onClick={() => handlePrint(null, () => contentToPrint.current)}
                                        variant='purple'
                                        className='ml-2'
                                    >
                                        <Icon name='Camera' />
                                    </Button>
                                </>
                            }
                        </div>
                    }
                    {header?.pagination &&
                        <div className='flex-container w-full justify-start gap-4 sm:justify-end'>
                            <Pagination {...header.pagination} />
                        </div>
                    }

                </header>
            }
            {
                actions &&
                <div className={cn('', actions?.className)}>
                    {actions?.toLeft && <div>{actions.toLeft}</div>}
                    {actions?.searchInput && <SearchInput {...actions.searchInput} />}
                    {actions?.dateChange?.datePickerWithRange && <DatePickerWithRange {...actions.dateChange.datePickerWithRange} />}
                    {actions?.dateChange?.datePicker && <DatePicker {...actions.dateChange.datePicker} />}
                    {actions?.optionsPopover && <OptionsPopover {...actions.optionsPopover} />}
                    {actions?.toRight && <div>{actions.toRight}</div>}

                </div>
            }
            <main ref={contentToPrint}>
                {error ? <>Error</> :
                    !isLoading && children
                }
            </main>
            {
                footer &&
                <footer>
                    {footer}
                </footer>
            }
        </section >
    )
}



