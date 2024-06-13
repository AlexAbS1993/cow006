import { expectedParsedDataType, gamesPartiesType, gamesType, messageForSendFromServerEnum, messageFromClientTypes, roomsType, usersType } from "../../types";
import { IWebSocketMessageController } from "./interface";
import ws from 'ws'
import { doRoomAction } from "./actions/doRoomAction";
import { enterTheRoomAction } from "./actions/enterTheRoomAction";
import { exitRoomAction } from "./actions/exitRoomAction";
import { startTheGameAction } from "./actions/startTheGameAction";
import { IGame } from "../Entities/Game/interface";
import { Iplayer } from "../Entities/Player/interface";
import { gameStartedResponseFromServerDataType, webSocketProcedureReportType } from "../Adds/Reports/webSocketReport.type";
import { webSocketReportMessagesLibrary } from "../consts/webSocketResponseMessage";
import { gameStartedInfoForResponseCreator } from "../Adds/Reports/webSocketResponseDataCreators";

export class ControllerStrategyToken implements IWebSocketMessageController {
    private parsedData: expectedParsedDataType
    private rooms: roomsType
    private users: usersType
    private id: string
    private games: gamesPartiesType
    private webSocket: ws
    private statedGames: gamesType
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
    }
    execute(): void {
        switch (this.parsedData.type) {
            case messageFromClientTypes.doRoomCreate: {
                doRoomAction(this.rooms, this.users[this.id], this.games)
                break
            }
            case messageFromClientTypes.enterTheRoom: {
                enterTheRoomAction(this.parsedData, this.webSocket, this.rooms, this.games, this.users[this.id])
                break
            }
            case messageFromClientTypes.setName: {
                const name = this.parsedData.data.name
                this.users[this.id].setName(name)
                this.webSocket.send(`Теперь ты ${name}`)
                break
            }
            case messageFromClientTypes.exitTheRoom: {
                exitRoomAction(this.parsedData, this.rooms, this.webSocket, this.users[this.id], this.games)
                break
            }
            case messageFromClientTypes.startTheGame: {
                let roomId = this.users[this.id].getRoomId() as string
                let initiator = this.games[roomId].getLeader() as Iplayer
                let process = startTheGameAction(this.parsedData, this.games[roomId],initiator, this.rooms[roomId], this.statedGames)
                if (process.success){
                    let currentGame = this.statedGames[this.users[this.id].getGameId() as string]
                    let gameStartedInfo:gameStartedResponseFromServerDataType = gameStartedInfoForResponseCreator(currentGame, this.games[roomId])
                    let report: webSocketProcedureReportType<gameStartedResponseFromServerDataType> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.gameStartedSuccessfully(),
                        type: messageForSendFromServerEnum.gameStarted,
                        data: gameStartedInfo
                    }
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