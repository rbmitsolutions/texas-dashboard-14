import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";

//libs
import Icon from "@/common/libs/lucida-icon";

//components
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ExcelDownloadButtonProps {
    fileName: string
    onDownload: () => Promise<any[] | undefined>
    isLoading?: boolean
}

export default function ExcelDownloadButton({ fileName, onDownload, isLoading = false }: ExcelDownloadButtonProps) {

    const [csvDownload, setCsvDownload] = useState<any[]>([]);
    const csvRef = useRef(null);

    const handleDownload = async () => {
        const data = await onDownload();

        if (!data?.length) {
            toast.error('No data to download');
            return;
        }

        setCsvDownload(data);
    }



    useEffect(() => {
        if (csvDownload.length > 0) {
            // Trigger download when csvDownload changes
            (csvRef.current as any)?.link?.click();
        }
    }, [csvDownload]);

    return (
        <>
            <Button
                size='iconExSm'
                variant='orange'
                onClick={handleDownload}
                disabled={isLoading}
                isLoading={isLoading}
            >
                {!isLoading &&
                    <Icon
                        name='FileDown'
                    />
                }
            </Button>
            <div className='none'>
                <CSVLink
                    ref={csvRef}
                    data={csvDownload}
                    filename={fileName}
                />
            </div>
        </>
    )
}