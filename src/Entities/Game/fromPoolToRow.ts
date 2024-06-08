import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { Iplayer } from "../Player/interface";
import { IPool } from "../Pool/interface";
import { IRow } from "../Row/interface";

export function fromPoolToRow(pool: IPool, rows: IRow[], players: Iplayer[]): procedureReportType<null> {
    for (let cell of pool.getPool()) {
        let indexRow = -1
        let currentCardsValue = -1
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const indexOfLastCardInRow = rows[rowIndex].countOfCards() - 1
            if (rows[rowIndex].getRow()[indexOfLastCardInRow]!.getNominal() < cell.card.getNominal()
                && rows[rowIndex].getRow()[indexOfLastCardInRow]!.getNominal() > currentCardsValue
            ) {
                indexRow = rowIndex
                currentCardsValue = rows[rowIndex].getRow()[indexOfLastCardInRow]!.getNominal()
            }
        }
        if (indexRow === -1) {
            return {
                success: false,
                message: reportMessagesLibrary.game.isNotMatchAnyRow,
                instance: null
            }
        }

    }
    return {
        success: true,
        message: reportMessagesLibrary.ok.okMessage,
        instance: null
    }
}