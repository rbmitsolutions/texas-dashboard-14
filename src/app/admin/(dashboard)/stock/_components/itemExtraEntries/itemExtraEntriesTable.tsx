import { Dispatch, SetStateAction } from "react";

//components
import { ExtraItemEntriesTable } from "./itemExtraEntriesColums";
import { BasicTable } from "@/components/common/basicTable";
import Wrap from "@/components/common/wrap";

//interface
import { IGETAllStockExtraItemEntryResponse, IGETStockDataQuery } from "@/hooks/stock/IGetStockDataHooks.interface";

interface ItemExtraEntriesTableProps {
    extraEntries: IGETAllStockExtraItemEntryResponse
    extraEntriesParams: IGETStockDataQuery
    setExtraEntriesParams: Dispatch<SetStateAction<IGETStockDataQuery>>
}

export default function ItemExtraEntreiesTable({
    extraEntries,
    extraEntriesParams,
    setExtraEntriesParams
}: ItemExtraEntriesTableProps) {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'PackageOpen',
                    title: 'Extra Entries'
                },
                pagination: {
                    onPageChange: (pagination) => setExtraEntriesParams(prev => ({
                        extra_item_entry: {
                            all: {
                                ...prev?.extra_item_entry?.all,
                                pagination
                            }
                        }
                    })),
                    queryPagination: extraEntriesParams?.extra_item_entry?.all?.pagination!,
                    pagination: extraEntries?.pagination
                }
            }}
        >
            <BasicTable
                columns={ExtraItemEntriesTable({
                })}
                data={extraEntries?.data || []}
            />
        </Wrap>
    )
}