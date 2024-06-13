import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { Icard } from "../Card/interface";
import { Iplayer } from "../Player/interface";
import { IPool, poolCellType } from "./interface";

export class Pool implements IPool {
    private pool: poolCellType[]
    private playersCount: number
    constructor(playersCount: number) {
        this.playersCount = playersCount
        this.pool = []
    }
    getPool(): { card: Icard; player: Iplayer; }[] {
        return this.pool
    }
    getCountOfPlaces(): { allover: number; free: number; } {
        return {
            allover: this.playersCount,
            free: this.playersCount - this.pool.length
        }
    }
    addCard(card: Icard, player: Iplayer): procedureReportType<IPool> {
        let report: procedureReportType<IPool>
        if (this.pool.some(cell => cell.player.getId() === player.getId())) {
            report = {
                message: reportMessagesLibrary.game.playersCardHasAlredyWhere,
                success: false,
                instance: this
            }
            return report
        }
        this.pool.push({
            card, player
        })
        report = {
            message: reportMessagesLibrary.ok.okMessage,
            success: true,
            instance: this
        }
        if (this.isAllSettled()) {
            this.sortPool()
        }
        return report
    }
    isAllSettled(): boolean {
        return this.playersCount === this.pool.length
    }
    sortPool(): { card: Icard; player: Iplayer; }[] {
        this.pool.sort((a, b) => a.card.getNominal() - b.card.getNominal())
        return this.pool
    }
    clear(): void {
        this.pool = []
        return
    }
}