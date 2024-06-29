import { expectedParsedDataType, gamesPartiesType, gamesType, messageForSendFromServerEnum, messageFromClientTypes, roomsType, usersType } from "../../types";
import { IWebSocketMessageController } from "./interface";
import ws from 'ws'
import { doRoomAction } from "./actions/doRoomAction";
import { enterTheRoomAction } from "./actions/enterTheRoomAction";
import { exitRoomAction } from "./actions/exitRoomAction";
import { startTheGameAction } from "./actions/startTheGameAction";
import { Iplayer } from "../Entities/Player/interface";
import { gameStartedResponseFromServerDataType, playersDataForResponseFromServerDataType, roomCreatedResponseFromServerDataType, roomEnterResponseFromServerDataType, webSocketProcedureReportType } from "../Adds/Reports/webSocketReport.type";
import { webSocketReportMessagesLibrary } from "../Adds/Reports/webSocketResponseMessage";
import { gameStartedInfoForResponseCreator } from "../Adds/Reports/webSocketResponseDataCreators/gameStartedInfoForResponseCreator";
import { roomCreatedForResponseCreator } from "../Adds/Reports/webSocketResponseDataCreators/roomCreatedForResponse";
import { IUser } from "./entities/user/interface";
import { roomEnterResponseDataCreator } from "../Adds/Reports/webSocketResponseDataCreators/roomEnterForResponse";
import { reportMessagesLibrary } from "../Adds/Reports/reportMessages";

export class ControllerStrategyToken implements IWebSocketMessageController {
    private parsedData: expectedParsedDataType
    private rooms: roomsType
    private users: usersType
    private id: string
    private games: gamesPartiesType
    private webSocket: ws
    private statedGames: gamesType
    private currentUser: IUser
    constructor(id: string, parsedData: expectedParsedDataType, rooms: roomsType, users: usersType, games: gamesPartiesType, webSocket: ws, statedGames: gamesType) {
        this.parsedData = parsedData
        this.rooms = rooms
        // Список всех юзеров с ключами в виде id
        this.users = users
        // ID текущего юзера
        this.id = id
        this.games = games
        this.webSocket = webSocket
        this.statedGames = statedGames
        this.currentUser = users[id]
    }
    execute(): void {
        switch (this.parsedData.type) {
            case messageFromClientTypes.doRoomCreate: {
                let doRoomResult = doRoomAction(this.rooms, this.currentUser, this.games)
                if (doRoomResult.success){
                    let reportData = roomCreatedForResponseCreator(this.currentUser)
                    let report: webSocketProcedureReportType<roomCreatedResponseFromServerDataType> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.roomCreated(reportData.roomId),
                        type: messageForSendFromServerEnum.roomCreated,
                        data: reportData
                    }
                    this.webSocket.send(JSON.stringify(report))
                }
                break
            }
            case messageFromClientTypes.enterTheRoom: {
                let enterTheRoomResult = enterTheRoomAction(this.parsedData.data.roomToEnter, this.webSocket, this.rooms, this.games, this.users[this.id])
                if (enterTheRoomResult.success){
                    let roomId = this.currentUser.getRoomId() as string
                    let reportData = roomEnterResponseDataCreator(roomId, this.rooms[roomId], this.games[roomId])
                    let report: webSocketProcedureReportType<roomEnterResponseFromServerDataType> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.userConnected(this.currentUser.getName()),
                        type: messageForSendFromServerEnum.userConnectToRoom,
                        data: reportData
                    }
                    for (let user of this.rooms[roomId as string]){
                        user.getWS()!.send(JSON.stringify(report))
                    }
                }
                else {
                    let report: webSocketProcedureReportType = {} as webSocketProcedureReportType
                    switch(enterTheRoomResult.message){
                        case reportMessagesLibrary.server.gameIsAlreadyStarted: {
                            report = {
                                success: false,
                                message: webSocketReportMessagesLibrary.gameHasBeenStartedAlready(),
                                type: messageForSendFromServerEnum.canNotEnterTheRoom
                            }
                            break
                        }
                        case reportMessagesLibrary.server.userAlreadyInRoom: {
                            report = {
                                success: false,
                                message: webSocketReportMessagesLibrary.gameHasBeenStartedAlready(),
                                type: messageForSendFromServerEnum.canNotEnterTheRoom
                            }
                        }
                    }
                    
                    this.webSocket.send(JSON.stringify(report))
                }
                break
            }
            case messageFromClientTypes.setName: {
                const name = this.parsedData.data.name
                this.users[this.id].setName(name)
                this.webSocket.send(`Теперь ты ${name}`)
                break
            }
            case messageFromClientTypes.exitTheRoom: {
                // Необходимо обратить внимание на валидацию входных данных
                if (!this.parsedData.data.roomFrom){
                    let report = {
                        success: false
                    }
                    return
                }
                let resultOfExit = exitRoomAction(this.parsedData, this.rooms, this.webSocket, this.users[this.id], this.games)
                if (resultOfExit.success){
                    let report: webSocketProcedureReportType<Pick<playersDataForResponseFromServerDataType, "name"|"id">&{leaderId: string}> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.userHasBeenLeaved(this.currentUser.getName() as string),
                        type: messageForSendFromServerEnum.userHasBeenLeave,
                        data: {
                            name: this.currentUser.getName(),
                            id: this.currentUser.getId(),
                            leaderId: this.games[this.parsedData.data.roomFrom].getLeader()?.getId() as string
                        }
                    }
                    this.webSocket.send(JSON.stringify(report))
                    // Если хоть кто-то остался в комнате и комната еще существует, то отправить сообщение всем о выходе игрока
                    if (this.rooms[this.parsedData.data.roomFrom]){
                        for (let client of this.rooms[this.parsedData.data.roomFrom]) {
                            client.getWS()!.send(JSON.stringify(report))
                        }
                    }
                }
                break
            }
            case messageFromClientTypes.startTheGame: {
                let roomId = this.users[this.id].getRoomId() as string
                let initiator = this.games[roomId].getLeader() as Iplayer
                let process = startTheGameAction(this.parsedData, this.games[roomId],initiator, this.rooms[roomId], this.statedGames)
                if (process.success){
                    let currentGame = this.statedGames[this.users[this.id].getGameId() as string]
                    // Формирование файла для отчёта по web-socket
                    let gameStartedInfo:gameStartedResponseFromServerDataType = gameStartedInfoForResponseCreator(currentGame, this.games[roomId])
                    let report: webSocketProcedureReportType<gameStartedResponseFromServerDataType> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.gameStartedSuccessfully(),
                        type: messageForSendFromServerEnum.gameStarted,
                        data: gameStartedInfo
                    }
                    // Отправка сообщения о начале игры всем участникам комнаты
                    for (let user of this.rooms[roomId]) {
                        user.getWS()!.send(JSON.stringify(report))
                    }
                }
                else {
                    let report: webSocketProcedureReportType = {
                        success: false,
                        message: webSocketReportMessagesLibrary.gameStartedFailed(),
                        type: messageForSendFromServerEnum.gameStarted
                    }
                    this.webSocket.send(JSON.stringify(report))
                }
                break
            }
            default: {

            }
        }
    }
}