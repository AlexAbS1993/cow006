import { exitRoomMessageType, roomsType, userType } from "../../../types"
import ws from 'ws'
import { reportMessagesLibrary } from "../../consts/reportMessages"
import { procedureReportType } from "../../Adds/Reports/procedureReport.type"

export function exitRoomAction(parsedData: exitRoomMessageType, rooms: roomsType, webSocket: ws, user: userType): procedureReportType<null> {
    const desiredRoom = parsedData.data.roomFrom
    if (rooms[desiredRoom]) {
        let usersSocket = webSocket
        rooms[desiredRoom] = rooms[desiredRoom].filter(client => client.currentClient !== usersSocket)
        usersSocket.send("Вы отключились от комнаты")
        for (let client of rooms[desiredRoom]) {
            client.currentClient.send(`${user.name ? user.name : user.id} вышел из комнаты`)
        }
    }
    user.inGame = false
    return {
        success: true,
        message: reportMessagesLibrary.ok.okMessage,
        instance: null
    }
}