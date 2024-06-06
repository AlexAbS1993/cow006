import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { Icard } from "../Card/interface";
import { Iplayer } from "../Player/interface";

export type cellsInfoType = {
    card: Icard,
    index: number
}

export interface IRow {
    getRow(): (Icard | null)[]
    addCard(card: Icard, player: Iplayer): procedureReportType<IRow>
    countOfCards(): number
    replace(card: Icard, player: Iplayer): void
    cellsInfo(): cellsInfoType
}