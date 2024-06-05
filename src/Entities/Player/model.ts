import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { IgameParty } from "../GameParty/interface";
import { Ihand } from "../Hand/interface";
import { Hand } from "../Hand/model";
import { Iplayer, playerInfoType, playersGameInfoType } from "./interface";

export class Player implements Iplayer {
    private info: playerInfoType
    private hand: Ihand = new Hand(10)
    private id: string
    private gameInfo: null | IgameParty
    private inGameStatus: boolean
    constructor(playersInfo: playerInfoType, id: string) {
        this.info = playersInfo
        this.id = id
        this.gameInfo = null
        this.inGameStatus = false
    }
    setInGame(value: boolean): void {
        this.inGameStatus = value
        return
    }
    inGame(): boolean {
        return this.inGameStatus
    }
    getGameInfo(): playersGameInfoType | null {
        if (!this.gameInfo) {
            return null
        }
        else {
            return {
                gameId: this.gameInfo.getGPid(),
                players: this.gameInfo.getPlayers()
            }
        }
    }
    defineGameInfo(gameInfo: IgameParty): procedureReportType<Iplayer> {
        this.gameInfo = gameInfo
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
    getId(): string {
        return this.id
    }
    getInfo(): playerInfoType {
        return this.info
    }
    changeInfo(newInfo: playerInfoType): procedureReportType<Iplayer> {
        this.info = newInfo
        return {
            success: true,
            instance: this,
            message: reportMessagesLibrary.ok.okMessage
        }
    }
    getHand(): Ihand {
        return this.hand
    }
    takeHand(hand: Ihand): procedureReportType<Iplayer> {
        this.hand = hand
        return {
            message: reportMessagesLibrary.ok.okMessage,
            instance: this,
            success: true
        }
    }
    cardsCount(): number {
        return this.hand.countOfCards()
    }
    discardCardFromHand(nO: number): procedureReportType<Iplayer> {
        this.hand.discard(nO)
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
}