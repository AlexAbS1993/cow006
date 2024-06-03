import { enterTheRoomMessageType, gamesType, roomsType, userType } from "../../../types"
import ws from "ws"
import { reportMessagesLibrary } from "../../consts/reportMessages"
import { procedureReportType } from "../../Adds/Reports/procedureReport.type"

export function enterTheRoomAction(parsedData: enterTheRoomMessageType, ws: ws, rooms: roomsType, games: gamesType, user: userType): procedureReportType<null> {
    const desiredRoom = parsedData.data.roomToEnter
    if (rooms[desiredRoom]) {
        if (!games[desiredRoom].isGameStarted() && !games[desiredRoom].isPartyFull()) {
            rooms[desiredRoom].push(user)
            for (let client of rooms[desiredRoom]) {
                if (client.currentClient !== ws) {
                    client.currentClient.send(`${user.name ? user.name : user.id} присоединился к комнате`)
                }
            }
            return {
                success: true,
                message: reportMessagesLibrary.ok.okMessage,
                instance: null
            }
        }
        else {
            ws.send("Извините, игра уже началась")
            return {
                success: false,
                message: reportMessagesLibrary.server.gameIsAlreadyStarted,
                instance: null
            }
        }
    }
    else {
        ws.send("Нет такой комнаты")
        return {
            success: false,
            message: reportMessagesLibrary.server.roomIsNotExist,
            instance: null
        }
    }
}