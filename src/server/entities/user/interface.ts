import ws from 'ws'

export interface IUser {
    getId(): string,
    getName(): string,
    setName(): string,
    getWS(): ws
    inGame(): boolean
    setInGame(value: boolean): void
    setRoom(roomId: string): void
    getRoomId(): string
}