import { messageForSendFromServerEnum } from "../../../types"

export type webSocketProcedureReportType<dataType = undefined> = {
    success: boolean,
    message: string,
    type: messageForSendFromServerEnum,
    data?: dataType
}


export type handDataForResponsFromServerDataType = {
    nominal: number,
    badPoint: number
}

export type playersDataForResponseFromServerDataType = {
    id: string,
    name: string,
    hand: handDataForResponsFromServerDataType[],
    isLeader: boolean
}

export type rowsDataForResponseFromServerDataType = (handDataForResponsFromServerDataType|null)[]

export type gameStartedResponseFromServerDataType = {
    id: string,
    roomId: string,
    gamePartyId: string,
    players: playersDataForResponseFromServerDataType[],
    rows:rowsDataForResponseFromServerDataType[]
}
export type roomCreatedResponseFromServerDataType = {
    roomId: string
}