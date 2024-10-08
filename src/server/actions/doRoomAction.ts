import { gamesPartiesType } from '../../../types';
import { v4 as uuid } from 'uuid'
import { roomsType } from '../../../types'
import { GameParty } from '../../Entities/GameParty/model'
import { playerInfoType } from '../../Entities/Player/interface'
import { Player } from '../../Entities/Player/model'
import { reportMessagesLibrary } from '../../Adds/Reports/reportMessages';
import { procedureReportType } from '../../Adds/Reports/procedureReport.type';
import { IUser } from '../entities/user/interface';

export function createShortRoomId() {
    return uuid().slice(0, 5)
}

// Экшн, создающий комнату и делающий игрока, создавшего её, лидером, принимающим решение о старте матча
export function doRoomAction(rooms: roomsType, user: IUser, games: gamesPartiesType): procedureReportType<null> {
    if(user.getRoomId()){
        return {
            success: false, 
            instance: null,
            message: reportMessagesLibrary.server.userAlreadyInRoom
        }
    }
    let roomId = createShortRoomId()
    rooms[roomId] = []
    rooms[roomId].push(user)
    const gameParty = new GameParty(roomId)
    // Создание дефолтоной информации об игроке без статистики
    const playersInfo: playerInfoType = {
        name: user.getName() as string,
        rang: 0,
        stats: {
            wins: 0,
            looses: 0
        }
    }
    const playerOne = new Player(playersInfo, user.getId())
    gameParty.addPlayer(playerOne)
    gameParty.setLeaderLikeALeader(playerOne)
    // Вероятнее всего "games" должен быть ещё одной сущностью
    games[roomId] = gameParty
    user.setRoom(roomId)
    return {
        success: true,
        message: reportMessagesLibrary.ok.okMessage,
        instance: null
    }
}