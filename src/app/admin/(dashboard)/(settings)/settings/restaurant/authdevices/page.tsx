'use client'
import { authDevicesColumnsTable } from "./_components/authDevicesColumns";
import AuthDevice from "./_components/createAuthDevice";
import Wrap from "@/components/common/wrap";

//hooks
import { useDELETERestaurantDataHooks, useGETRestaurantDataHooks, usePOSTRestaurantDataHooks } from "@/hooks/restaurant/restaurantDataHooks";

//interfaces
import { IQueryPagination } from "@/common/types/settings.interface";
import { BasicTable } from "@/components/common/basicTable";

export default function AuthDevices() {
    const {
        restaurantAllAuthorizedDevices: authorizedDevices,
        setGETRestaurantDataParams: setAuthorizedDevicesParams,
        GETRestaurantDataParams: authorizedDevicesParams,
        refetchRestaurantData: toRefetch,
        restaurantDataError: error
    } = useGETRestaurantDataHooks({
        query: 'AUTHORIZED_DEVICES',
        defaultParams: {
            authorizedDevices: {
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
        createRestaurantData: createAuthorizedDevice,
    } = usePOSTRestaurantDataHooks({
        query: 'AUTHORIZED_DEVICES',
        toRefetch
    })

    const {
        deleteRestaurantData: deleteAuthorizedDevices
    } = useDELETERestaurantDataHooks({
        query: 'AUTHORIZED_DEVICES',
        toRefetch
    })

    return (
        <Wrap
            header={{
                title: {
                    title: 'Devices',
                    icon: 'TabletSmartphone'
                },
                pagination: {
                    onPageChange: (pagination: IQueryPagination) => setAuthorizedDevicesParams(prev => ({
                        authorizedDevices: {
                            all: {
                                pagination
                            }
                        }
                    })),
                    pagination: authorizedDevices?.pagination,
                    queryPagination: authorizedDevicesParams?.authorizedDevices?.all?.pagination!
                }
            }}
            actions={{
                toRight: <AuthDevice createAuthorizedDevice={createAuthorizedDevice} />,
                className: 'flex justify-end'
            }}
            error={error}
        >
            <BasicTable
                columns={authDevicesColumnsTable({
                    deleteAuthorizedDevices
                })}
                data={authorizedDevices?.data || []}
            />
        </Wrap>
    )
}