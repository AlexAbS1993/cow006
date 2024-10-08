import { Icard } from "../Card/interface"
import { procedureReportType } from "../../Adds/Reports/procedureReport.type"

export interface Ihand{
    addCard(card: Icard): procedureReportType<Ihand>
    discard(nO:number): procedureReportType<Ihand>
    countOfCards(): number
    getCard(nO: number): Icard | null
    __getHand(): Icard[]
}