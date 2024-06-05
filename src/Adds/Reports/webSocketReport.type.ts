import { messageForSendFromServerEnum } from "../../../types"

export type webSocketProcedureReportType<dataType = undefined> = {
    success: boolean,
    message: string,
    type: messageForSendFromServerEnum,
    data?: dataType
}