import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { Icard } from "../Card/interface"
import { Iplayer } from "../Player/interface"

export type poolCellType = {
    card: Icard
    player: Iplayer
}

export type countOfPlacesType = {
    allover: number
    free: number
}

export interface IPool {
    getPool(): poolCellType[]
    getCountOfPlaces(): countOfPlacesType
    addCard(card: Icard, player: Iplayer): procedureReportType<IPool>
    isAllSettled(): boolean
    sortPool(): poolCellType[]
    clear(): void
}