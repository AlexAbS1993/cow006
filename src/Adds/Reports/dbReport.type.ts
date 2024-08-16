import { reportMessagesLibraryType } from "./reportMessages"

export type DataBaseReportType<datatype = null> = {
    success: boolean,
    message: reportMessagesLibraryType,
    type: DBreportTypeEnum,
    data?: datatype
}

export enum DBreportTypeEnum {
    "Not Found" = "Not Found",
    "Created" = "Created",
    "NotCreated" = "NotCreated",
    "Get" = "Get"
}