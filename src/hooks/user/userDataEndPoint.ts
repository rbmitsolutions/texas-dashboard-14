
import { EndPointsTypes } from "@/common/types/routers/endPoints.types";

export const userEndPoint = {
    DETAILS: {
        url: EndPointsTypes['USER_ENDPOINT'],
        createSucess: "Details created successfully!",
        createError: "Details creation failed!",
        updateSucess: "Details updated successfully!",
        updateError: "Details update failed!",
        deleteSucess: "Details deleted successfully!",
        deleteError: "Details delete failed!",
    },
    USER_COMPANY: {
        url: EndPointsTypes['COMPANY_USERS_ENDPOINT'],
        createSucess: "User company created successfully!",
        createError: "User company creation failed!",
        updateSucess: "User company updated successfully!",
        updateError: "User company update failed!",
        deleteSucess: "User company deleted successfully!",
        deleteError: "User company delete failed!",
    },
    USER_ROSTER: {
        url: EndPointsTypes['USER_ROSTER_ENDPOINT'],
        queryParams: 'roster',
        updateSucess: "Roster updated successfully!",
        updateError: "Roster update failed!",
        deleteSucess: "Roster deleted successfully!",
        deleteError: "Roster delete failed!",
        createSucess: 'Roster created successfully!',
        createError: "Roster creation failed!",
    },
    USER_REQUESTS: {
        url: EndPointsTypes['USER_REQUEST_ENDPOINT'],
        queryParams: 'requests',
        updateSucess: "Request updated successfully!",
        updateError: "Request update failed!",
        deleteSucess: "Request deleted successfully!",
        deleteError: "Request delete failed!",
        createSucess: 'Request created successfully!',
        createError: "Request creation failed!",
    },
}