import ws from 'ws'

export interface IUser {
    getId(): string,
    getName(): string,
    setName(name: string): void,
    getWS(): ws | null
    inGame(): boolean
    setInGame(value: boolean): void
    setRoom(roomId: string): void
    getRoomId(): string | null
    setCurrentWebSocket(ws: ws): void
    getGameId(): string | null
    setGameId(id: string): void
}