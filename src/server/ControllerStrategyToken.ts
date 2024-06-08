import { expectedParsedDataType, gamesType, messageFromClientTypes, roomsType, usersType } from "../../types";
import { IWebSocketMessageController } from "./interface";
import ws from 'ws'
import { doRoomAction } from "./actions/doRoomAction";
import { enterTheRoomAction } from "./actions/enterTheRoomAction";
import { exitRoomAction } from "./actions/exitRoomAction";

export class ControllerStrategyToken implements IWebSocketMessageController {
    private parsedData: expectedParsedDataType
    private rooms: roomsType
    private users: usersType
    private id: string
    private games: gamesType
    private webSocket: ws
    constructor(id: string, parsedData: expectedParsedDataType, rooms: roomsType, users: usersType, games: gamesType, webSocket: ws) {
        this.parsedData = parsedData
        this.rooms = rooms
        // Список всех юзеров с ключами в виде id
        this.users = users
        // ID текущего юзера
        this.id = id
        this.games = games
        this.webSocket = webSocket
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

                break
            }
            default: {

            }
        }
    }
}