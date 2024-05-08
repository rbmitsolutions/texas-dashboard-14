'use client'
import { useScreenshot } from 'use-react-screenshot'

import Icon from "@/common/libs/lucida-icon";
import { icons } from "lucide-react"
import { cn } from "@/common/libs/shadcn/utils";

//components
import SearchInput, { SearchInputProps } from "../searchInput";
import { DatePicker, DatePickerWithRange, IDatePicker, DatePickerWithRangeProps } from "../datePicker";
import OptionsPopover, { OptionsPopoverProps } from "../optionsPopover";
import Pagination, { PaginationProps } from "../pagination";
import { useEffect, useRef, useState } from "react";
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
    const ref = useRef(null);
    const imageRef = useRef(null);
    const [image, takeScreenshot] = useScreenshot();
    const [isDownload, setIsDownload] = useState(false)

    const downloadScreenshot = async () => {
        setIsDownload(true)
        try {
            await takeScreenshot(ref.current)
        } catch (error) {
            console.error(error);
        } finally {
            setIsDownload(false)
        }
    }

    useEffect(() => {
        if (image) {
            const a: any = imageRef.current;
            a.click();
            setIsDownload(false)
        }
    }, [image]);


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
                                        onClick={downloadScreenshot}
                                        variant='purple'
                                        className='ml-2'
                                        disabled={isDownload}
                                    >
                                        <Icon name='Camera' />
                                    </Button>
                                    <a
                                        href={image}
                                        download='screenshot.png'
                                        className='hidden'
                                        ref={imageRef}
                                    />
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
            {actions &&
                <div className={cn('', actions?.className)}>
                    {actions?.toLeft && <div>{actions.toLeft}</div>}
                    {actions?.searchInput && <SearchInput {...actions.searchInput} />}
                    {actions?.dateChange?.datePickerWithRange && <DatePickerWithRange {...actions.dateChange.datePickerWithRange} />}
                    {actions?.dateChange?.datePicker && <DatePicker {...actions.dateChange.datePicker} />}
                    {actions?.optionsPopover && <OptionsPopover {...actions.optionsPopover} />}
                    {actions?.toRight && <div>{actions.toRight}</div>}

                </div>
            }
            <main ref={ref}>
                {error ? <>Error</> :
                    !isLoading && children
                }
            </main>
            {footer &&
                <footer>
                    {footer}
                </footer>
            }
        </section>
    )
}



