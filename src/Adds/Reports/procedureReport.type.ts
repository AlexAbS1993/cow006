import { reportMessagesLibraryType } from "./reportMessages"

export type procedureReportType<Instance> = {
    success: boolean,
    instance: Instance,
    message: reportMessagesLibraryType
}