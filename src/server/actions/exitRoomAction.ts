import { exitRoomMessageType, roomsType, userType } from "../../../types"
import ws from 'ws'

export function exitRoomAction(parsedData: exitRoomMessageType, rooms: roomsType, webSocket: ws, user: userType) {
    const desiredRoom = parsedData.data.roomFrom
    if (rooms[desiredRoom]) {
        let usersSocket = webSocket
        rooms[desiredRoom] = rooms[desiredRoom].filter(client => client.currentClient !== usersSocket)
        usersSocket.send("Вы отключились от комнаты")
        for (let client of rooms[desiredRoom]) {
            client.currentClient.send(`${user.name ? user.name : user.id} вышел из комнаты`)
        }
    }
}