import { exitRoomMessageType, gamesPartiesType, messageForSendFromServerEnum, roomsType } from "../../../types"
import ws from 'ws'
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages"
import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { IUser } from "../entities/user/interface"

export function exitRoomAction(parsedData: exitRoomMessageType, rooms: roomsType, webSocket: ws, user: IUser, gamesParty: gamesPartiesType): procedureReportType<null> {
    // userID совпадает с playerID
    const desiredRoom = parsedData.data.roomFrom
    if (rooms[desiredRoom]) {
        if (gamesParty[desiredRoom].isGameStarted()){
            // Необходимо совершить закрытие игровой сессии
        }
        let usersSocket = webSocket
        rooms[desiredRoom] = rooms[desiredRoom].filter(client => client.getWS() !== usersSocket)
        let playersInGame = gamesParty[desiredRoom].getPlayers()
        // Если игрок, покидающий комнату, лидер, то лидерство переходит другому player
        if (gamesParty[desiredRoom].getLeader()!.getId() === user.getId()){
            for (let player of playersInGame){
                if (player.getId() !== gamesParty[desiredRoom].getLeader()!.getId()){
                    gamesParty[desiredRoom].setLeaderLikeALeader(player)
                    break
                }
            }
        }
        for (let player of playersInGame) {
            if (player.getId() === user.getId()) {
                player.setInGame(false)
            }
        }
        user.setInGame(false)
        user.setRoom(null)
        gamesParty[desiredRoom].deletePlayer(user.getId() as string)
    }
    return {
        success: true,
        message: reportMessagesLibrary.ok.okMessage,
        instance: null
    }
}