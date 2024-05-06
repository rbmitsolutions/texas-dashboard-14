export type IDELETEUserDataQueryType = "USER_REQUESTS" | "USER_FILES";

export interface IDELETEUserDataBody {
    request?: {
        id: string;
    }
    file?: {
        id: string;
    }
}