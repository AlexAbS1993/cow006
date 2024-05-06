import { reportMessagesLibraryType } from "../../consts/reportMessages"

export type procedureReportType<Instance> = {
    success: boolean,
    instance: Instance,
    message: reportMessagesLibraryType
}