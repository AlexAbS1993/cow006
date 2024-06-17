import { IUser } from "../../../server/entities/user/interface";
import { playersDataForResponseFromServerDataType, roomEnterResponseFromServerDataType } from "../webSocketReport.type";

export function roomEnterResponseDataCreator(roomId: string, players: IUser[],  ): roomEnterResponseFromServerDataType{
    let usersInfo:Omit<playersDataForResponseFromServerDataType, "hand" | "isLeader">[] = []
    for (let player of players){
        usersInfo.push({
            id: player.getId(),
            name: player.getName()
        })
    }
    return {
        roomId,
        gamePartyId: roomId,
        players: usersInfo,
        newPlayer: usersInfo[usersInfo.length - 1]
    }
}