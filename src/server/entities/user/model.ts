import { IUser } from "./interface";
import ws from 'ws'


export class User implements IUser {
    private id: string
    private name: string
    private webSocket: ws | null
    private roomId: string | null
    private inGameStatus: boolean
    private gameId: string| null
    constructor(id: string, name: string) {
        this.id = id
        this.name = name
        this.webSocket = null
        this.roomId = null
        this.inGameStatus = false
        this.gameId = null
    }
    setGameId(id: string): void {
        this.gameId = id
    }
    getGameId(): string|null {
        return this.gameId
    }
    setCurrentWebSocket(ws: ws): void {
        this.webSocket = ws
        return
    }
    getId(): string {
        return this.id
    }
    getName(): string {
        return this.name
    }
    setName(name: string): void {
        this.name = name
        return
    }
    getWS(): ws | null {
        return this.webSocket
    }
    inGame(): boolean {
        return this.inGameStatus
    }
    setInGame(value: boolean): void {
        this.inGameStatus = value
        return
    }
    setRoom(roomId: string): void {
        this.roomId = roomId
        return
    }
    getRoomId(): string | null {
        return this.roomId
    }
}