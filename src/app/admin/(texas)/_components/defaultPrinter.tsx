import { parseCookies, setCookie } from "nookies"
import { useEffect } from "react"
import { PrinterIcon } from "lucide-react"

//components
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"

//store
import { usePrintersStore } from "@/store/restaurant/printers"

//interface
import { IPrinters } from "@/common/types/restaurant/printers.interface"

interface DefaultPrinterProps {
    printers: IPrinters[]
}

export default function DefaultPrinter({ printers }: DefaultPrinterProps) {
    const { defaultPrinter, setDefaultPrinter } = usePrintersStore()

    const getDefaultPrinter = async () => {
        const tokenKey: string = process.env.NEXT_PUBLIC_DEFAULT_PRINTER as string;
        const cookie = await parseCookies()
        let token: IPrinters | undefined

        if (cookie[tokenKey]) {
            token = JSON.parse(cookie[tokenKey])
        }

        if (token) {
            setDefaultPrinter(token)
        }
    }

    const onPrinterSelected = async (printer: IPrinters) => {
        await setCookie(
            null,
            process.env.NEXT_PUBLIC_DEFAULT_PRINTER as string,
            JSON.stringify(printer),
            {
                maxAge: 500 * 60 * 60, //20day
                path: "/",
            }
        )
        setDefaultPrinter(printer)
    }

    useEffect(() => {
        getDefaultPrinter()
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size='iconSm'
                    variant={defaultPrinter ? 'pink' : 'outline'}
                    className='w-full'
                >
                    <PrinterIcon size={12} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <h3 className='text-lg font-bold'>Select Default Printer</h3>
                </DialogHeader>
                <div className='grid grid-cols-3 gap-2'>
                    {printers?.map(p => {
                        return (
                            <Button
                                key={p?.id}
                                className='text-wrap h-20 min-h-18'
                                variant={defaultPrinter?.id === p?.id ? 'pink' : 'outline'}
                                onClick={() => onPrinterSelected(p)}
                            >
                                {p?.title}
                            </Button>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}