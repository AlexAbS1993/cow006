import { expectedParsedDataType, gamesType, messageFromClientTypes, roomsType, usersType } from "../../types";
import { GameParty } from "../Entities/GameParty/model";
import { playerInfoType } from "../Entities/Player/interface";
import { Player } from "../Entities/Player/model";
import { IWebSocketMessageController } from "./interface";
import { v4 as uuid } from 'uuid'
import ws from 'ws'

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
        this.users = users
        this.id = id
        this.games = games
        this.webSocket = webSocket
    }
    execute(): void {
        switch (this.parsedData.type) {
            case messageFromClientTypes.doRoomCreate: {
                let roomId = uuid().slice(0, 5)
                this.rooms[roomId] = []
                this.rooms[roomId].push(this.users[this.id])
                const gameParty = new GameParty(roomId)
                const playersInfo: playerInfoType = {
                    name: this.users[this.id].name || this.id,
                    rang: 0,
                    stats: {
                        wins: 0,
                        looses: 0
                    }
                }
                const playerOne = new Player(playersInfo, this.id)
                gameParty.addPlayer(playerOne)
                gameParty.setLeaderLikeALeader(playerOne)
                this.games[roomId] = gameParty
                break
            }
            case messageFromClientTypes.enterTheRoom: {
                const desiredRoom = this.parsedData.data.roomToEnter
                if (this.rooms[desiredRoom]) {
                    if (!this.games[desiredRoom].isGameStarted() || this.games[desiredRoom].isPartyFull()) {
                        this.rooms[desiredRoom].push(this.users[this.id])
                        for (let client of this.rooms[desiredRoom]) {
                            if (client.currentClient !== this.webSocket) {
                                client.currentClient.send(`${this.users[this.id].name ? this.users[this.id].name : this.id} присоединился к комнате`)
                            }
                        }
                    }
                    else {
                        this.webSocket.send("Извините, игра уже началась")
                    }
                }
                else {
                    this.webSocket.send("Нет такой комнаты")
                }
                break
            }
            case messageFromClientTypes.setName: {
                const name = this.parsedData.data.name
                this.users[this.id].name = name
                this.webSocket.send(`Теперь ты ${name}`)
                break
            }
            case messageFromClientTypes.exitTheRoom: {
                const desiredRoom = this.parsedData.data.roomFrom
                if (this.rooms[desiredRoom]) {
                    let user = this.webSocket
                    this.rooms[desiredRoom] = this.rooms[desiredRoom].filter(client => client.currentClient !== user)
                    console.log(this.rooms[desiredRoom])
                    user.send("Вы отключились от комнаты")
                    for (let client of this.rooms[desiredRoom]) {
                        client.currentClient.send(`${this.users[this.id].name ? this.users[this.id].name : this.id} вышел из комнаты`)
                    }
                }
                break
            }
            default: {

            }
        }
    }
}