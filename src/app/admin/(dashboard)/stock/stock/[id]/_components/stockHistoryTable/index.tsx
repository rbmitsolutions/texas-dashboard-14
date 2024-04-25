import { Dispatch, SetStateAction } from "react";

//components
import { BasicTable } from "@/components/common/basicTable";
import Wrap from "@/components/common/wrap";

//interface
import { IGETAllStockItemHistoryResponse, IGETStockDataQuery } from "@/hooks/stock/IGetStockDataHooks.interface";
import { StockItemHistoryTable } from "./stockHistoryColums";

interface ItemHistoryTableProps {
    itemHistory: IGETAllStockItemHistoryResponse
    itemHistoryParams: IGETStockDataQuery
    setItemHistoryParams: Dispatch<SetStateAction<IGETStockDataQuery>>
}

export default function ItemHistoryTable({
    itemHistory,
    itemHistoryParams,
    setItemHistoryParams
}: ItemHistoryTableProps) {
    return (
        <Wrap
            header={{
                title: {
                    icon: 'ArrowDown01',
                    title: 'History Out'
                },
                pagination: {
                    onPageChange: (pagination) => setItemHistoryParams(prev => ({
                        item_history: {
                            all: {
                                ...prev?.item_history?.all,
                                pagination
                            }
                        }
                    })),
                    queryPagination: itemHistoryParams?.extra_item_entry?.all?.pagination!,
                    pagination: itemHistory?.pagination
                }
            }}
        >
           <BasicTable
                columns={StockItemHistoryTable({
                })}
                data={itemHistory?.data || []}
            /> 
        </Wrap>
    )
}