import { enterTheRoomMessageType, gamesPartiesType, messageForSendFromServerEnum, roomsType } from "../../../types"
import ws from "ws"
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages"
import { webSocketProcedureReportType } from "../../Adds/Reports/webSocketReport.type"
import { webSocketReportMessagesLibrary } from "../../Adds/Reports/webSocketResponseMessage"
import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { playerInfoType } from "../../Entities/Player/interface"
import { Player } from "../../Entities/Player/model"
import { IUser } from "../entities/user/interface"


export function enterTheRoomAction(parsedData: enterTheRoomMessageType, ws: ws, rooms: roomsType, games: gamesPartiesType, user: IUser): procedureReportType<null> {
    const desiredRoom = parsedData.data.roomToEnter
    if (rooms[desiredRoom]) {
        if (!games[desiredRoom].isGameStarted() && !games[desiredRoom].isPartyFull()) {
            rooms[desiredRoom].push(user)
            const playersInfo: playerInfoType = {
                name: user.getName() as string,
                rang: 0,
                stats: {
                    wins: 0,
                    looses: 0
                }
            }
            let newPlayer = new Player(playersInfo, user.getId())
            games[desiredRoom].addPlayer(newPlayer)
            for (let client of rooms[desiredRoom]) {
                if (client.getWS() !== ws) {
                    let report: webSocketProcedureReportType = {
                        success: true,
                        message: webSocketReportMessagesLibrary.userConnected(user.getName() as string),
                        type: messageForSendFromServerEnum.userConnectToRoom
                    }
                    client.getWS()!.send(JSON.stringify(report))
                }
            }
            user.setRoom(desiredRoom)
            return {
                success: true,
                message: reportMessagesLibrary.ok.okMessage,
                instance: null
            }
        }
        else {
            let report: webSocketProcedureReportType = {
                success: false,
                message: webSocketReportMessagesLibrary.gameHasBeenStartedAlready(),
                type: messageForSendFromServerEnum.gameHasBeenStartedAlready
            }
            ws.send(JSON.stringify(report))
            return {
                success: false,
                message: reportMessagesLibrary.server.gameIsAlreadyStarted,
                instance: null
            }
        }
    }
    else {
        let report: webSocketProcedureReportType = {
            success: false,
            message: webSocketReportMessagesLibrary.roomIsNotExists(),
            type: messageForSendFromServerEnum.roomIsNotExists
        }
        ws.send(JSON.stringify(report))
        return {
            success: false,
            message: reportMessagesLibrary.server.roomIsNotExist,
            instance: null
        }
    }
}