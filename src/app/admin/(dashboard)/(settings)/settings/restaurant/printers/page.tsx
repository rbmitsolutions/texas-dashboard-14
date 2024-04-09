'use client'
import Wrap from "@/components/common/wrap";

//components
import { PrintersColumnsTable } from "./_components/printersColumns";
import CreatePrintersForm from "./_components/createPrintersForm";
import { BasicTable } from "@/components/common/basicTable";

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

export default function PrintersSettings() {
    const {
        restaurantAllPrinters: printers,
        isRestaurantDataFetching: isPrinterLoading,
        setGETRestaurantDataParams: setPrinters,
        GETRestaurantDataParams: GETPrinters,
        refetchRestaurantData: refetchPrinters
    } = useGETRestaurantDataHooks({
        query: 'PRINTERS',
        defaultParams: {
            printers: {
                all: {
                    pagination: {
                        take: 20,
                        skip: 0
                    }
                }
            }
        }
    })

    const {
        createRestaurantData: createPrinter,
        isCreateRestaurantDataLoading: isCreatePrinterLoading
    } = usePOSTRestaurantDataHooks({
        query: 'PRINTERS',
        toRefetch: refetchPrinters
    })

    const {
        deleteRestaurantData: deletePrinter,
    } = useDELETERestaurantDataHooks({
        query: 'PRINTERS',
        toRefetch: refetchPrinters
    })

    return (
        <div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Wrap
                    header={{
                        title: {
                            title: 'Printers',
                            icon: 'Printer'
                        },
                        pagination: {
                            onPageChange: (pagination) => setPrinters(prev => ({
                                ...prev,
                                printers: {
                                    all: {
                                        ...prev.printers?.all,
                                        pagination
                                    }
                                }
                            })),
                            pagination: printers?.pagination,
                            queryPagination: GETPrinters?.printers?.all?.pagination!,
                            isFetching: isPrinterLoading
                        }
                    }}
                    isLoading={isPrinterLoading}
                    className='rounded-xl border-2 p-4'
                >
                    <BasicTable
                        columns={PrintersColumnsTable({
                            onDelete: (id: string) => deletePrinter({
                                printer: {
                                    id
                                }
                            }),

                        })}
                        data={printers?.data}
                    />
                </Wrap>
                <CreatePrintersForm
                    createPrinter={createPrinter}
                    isLoading={isCreatePrinterLoading}
                />
            </div>
        </div>
    )
}