import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary, reportMessagesLibraryType } from "../../Adds/Reports/reportMessages";
import { Icard } from "../Card/interface";
import { Iplayer } from "../Player/interface";
import { IRow, cellsInfoType } from "./interface";

export class Row implements IRow {
    private row: (Icard | null)[]
    private rowLengthLimit = 4
    constructor(initialCard: Icard) {
        this.row = [initialCard, null, null, null, null]
    }
    private setInitial(card: Icard) {
        this.row = [card, null, null, null, null]
    }
    getRow(): (Icard | null)[] {
        return this.row
    }
    addCard(card: Icard, player: Iplayer): procedureReportType<IRow> {
        let lastIndexOfCard = this.cellsInfo().index
        if (lastIndexOfCard === this.rowLengthLimit) {
            this.replace(card, player)
            return {
                instance: this,
                message: reportMessagesLibrary.game.replaced,
                success: false
            }
        }
        this.getRow()[lastIndexOfCard + 1] = card
        return {
            instance: this,
            message: reportMessagesLibrary.ok.okMessage,
            success: true
        }
    }
    countOfCards(): number {
        return this.cellsInfo().index + 1
    }
    replace(card: Icard, player: Iplayer): void {
        for (let cardInRow of this.row) {
            if (cardInRow !== null) {
                player.getPenaltySet().addCard(cardInRow)
            }
        }
        this.setInitial(card)
    }
    cellsInfo(): cellsInfoType {
        let lastIndex = 0
        let lastCard = this.row[0]
        for (let i = 1; i < this.row.length; i++) {
            if (this.row[i] === null) {
                return {
                    card: lastCard as Icard,
                    index: lastIndex
                }
            }
            else {
                lastCard = this.row[i]
                lastIndex = i
            }
        }
        return {
            card: lastCard as Icard,
            index: lastIndex
        }
    }
}