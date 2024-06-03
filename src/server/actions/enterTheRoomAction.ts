import { enterTheRoomMessageType, gamesType, roomsType, userType } from "../../../types"
import ws from "ws"

export function enterTheRoomAction(parsedData: enterTheRoomMessageType, ws: ws, rooms: roomsType, games: gamesType, user: userType) {
    const desiredRoom = parsedData.data.roomToEnter
    if (rooms[desiredRoom]) {
        if (!games[desiredRoom].isGameStarted() && !games[desiredRoom].isPartyFull()) {
            rooms[desiredRoom].push(user)
            for (let client of rooms[desiredRoom]) {
                if (client.currentClient !== ws) {
                    client.currentClient.send(`${user.name ? user.name : user.id} присоединился к комнате`)
                }
            }
        }
        else {
            ws.send("Извините, игра уже началась")
        }
    }
    else {
        ws.send("Нет такой комнаты")
    }
}