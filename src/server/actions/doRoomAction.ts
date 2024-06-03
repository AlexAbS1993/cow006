import { gamesType, userType } from '../../../types';
import { v4 as uuid } from 'uuid'
import { roomsType, usersType } from '../../../types'
import { GameParty } from '../../Entities/GameParty/model'
import { playerInfoType } from '../../Entities/Player/interface'
import { Player } from '../../Entities/Player/model'
import { reportMessagesLibrary } from '../../consts/reportMessages';
import { procedureReportType } from '../../Adds/Reports/procedureReport.type';

export function createShortRoomId() {
    return uuid().slice(0, 5)
}

// Экшн, создающий комнату и делающий игрока, создавшего её, лидером, принимающим решение о старте матча
export function doRoomAction(rooms: roomsType, user: userType, games: gamesType): procedureReportType<null> {
    let roomId = createShortRoomId()
    rooms[roomId] = []
    rooms[roomId].push(user)
    const gameParty = new GameParty(roomId)
    // Создание дефолтоной информации об игроке без статистики
    const playersInfo: playerInfoType = {
        name: user.name as string,
        rang: 0,
        stats: {
            wins: 0,
            looses: 0
        }
    }
    const playerOne = new Player(playersInfo, user.id)
    gameParty.addPlayer(playerOne)
    gameParty.setLeaderLikeALeader(playerOne)
    // Вероятнее всего "games" должен быть ещё одной сущностью
    games[roomId] = gameParty
    user.inGame = true
    return {
        success: true,
        message: reportMessagesLibrary.ok.okMessage,
        instance: null
    }
}