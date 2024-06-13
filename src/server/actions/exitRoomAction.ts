import { exitRoomMessageType, gamesPartiesType, messageForSendFromServerEnum, roomsType } from "../../../types"
import ws from 'ws'
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages"
import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { webSocketReportMessagesLibrary } from "../../Adds/Reports/webSocketResponseMessage"
import { webSocketProcedureReportType } from "../../Adds/Reports/webSocketReport.type"
import { IUser } from "../entities/user/interface"

export function exitRoomAction(parsedData: exitRoomMessageType, rooms: roomsType, webSocket: ws, user: IUser, games: gamesPartiesType): procedureReportType<null> {
    const desiredRoom = parsedData.data.roomFrom
    if (rooms[desiredRoom]) {
        let usersSocket = webSocket
        rooms[desiredRoom] = rooms[desiredRoom].filter(client => client.getWS() !== usersSocket)
        let playersInGame = games[desiredRoom].getPlayers()
        for (let player of playersInGame) {
            if (player.getId() === user.getId()) {
                player.setInGame(false)
            }
        }
        user.setInGame(false)
        games[desiredRoom].deletePlayer(user.getId() as string)
        let report: webSocketProcedureReportType = {
            success: true,
            message: webSocketReportMessagesLibrary.userHasBeenLeaved(user.getName() as string),
            type: messageForSendFromServerEnum.userHasBeenLeave
        }
        usersSocket.send(JSON.stringify(report))
        for (let client of rooms[desiredRoom]) {
            client.getWS()!.send(JSON.stringify(report))
        }
    }
    return {
        success: true,
        message: reportMessagesLibrary.ok.okMessage,
        instance: null
    }
}