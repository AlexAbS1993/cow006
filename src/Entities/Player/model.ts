import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { Icard } from "../Card/interface";
import { Ihand } from "../Hand/interface";
import { Hand } from "../Hand/model";
import { Iplayer, playerInfoType } from "./interface";

export class Player implements Iplayer {
    private info: playerInfoType
    private hand: Ihand = new Hand(10)
    constructor(playersInfo: playerInfoType){
        this.info = playersInfo
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