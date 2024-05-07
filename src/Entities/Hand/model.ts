import { Icard } from "../Card/interface";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { Ihand } from "./interface";
import { reportMessagesLibrary } from "../../consts/reportMessages";

export class Hand implements Ihand {
    private limit: number;
    private hand: Icard[] = []
    constructor(limit: number){
        this.limit = limit
    }
    countOfCards(): number {
        return this.hand.length
    }
    addCard(card: Icard): procedureReportType<Ihand> {
        if (this.hand.length < this.limit){
            this.hand.push(card)
            return {
                success: true,
                message: reportMessagesLibrary.ok.okMessage,
                instance: this
            }
        }
        return {
            success: false,
            instance: this,
            message: reportMessagesLibrary.Hand.overLimit
        }
    }
    discard(nO: number): procedureReportType<Ihand> {
        if (this.limit === 0){
            return {
                success: false,
                instance: this,
                message: reportMessagesLibrary.Hand.handIsEmpty
            }
        }
        if (this.hand.findIndex(card => card.getNominal() === nO) === -1){
            return {
                success: false,
                instance: this,
                message: reportMessagesLibrary.Hand.noRequiredCardInHand
            }
        }
        this.hand = this.hand.filter(card => card.getNominal() !== nO)
        return {
            success: true,
            instance: this, 
            message: reportMessagesLibrary.ok.okMessage
        }
        }
   }
