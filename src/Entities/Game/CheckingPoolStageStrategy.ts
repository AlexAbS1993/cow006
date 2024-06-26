import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { GameStates } from "../../consts/rules";
import { Icard } from "../Card/interface";
import { Iplayer } from "../Player/interface";
import { IPool } from "../Pool/interface";
import { IRow } from "../Row/interface";
import { ProcessGameStrategy } from "./ProcessGameStateStrategy";
import { IGame, IStateForGame, resultEndGameType } from "./interface";
import { Game } from "./model";

export class CheckingPooStateStrategy implements IStateForGame {
    private name: GameStates
    private game: Game
    private pool: IPool
    private rows: IRow[]
    private needToSelect: boolean
    private poolsCellNeedToSelect: number
    private poolIndexFlagToCheck: number
    constructor(game: Game, name: GameStates) {
        this.name = name
        this.game = game
        this.pool = game.getPool()
        this.rows = game.getRows()
        this.needToSelect = false
        this.poolsCellNeedToSelect = -1
        this.poolIndexFlagToCheck = 0
    }
    nextStepOfState() {
        if (this.pool.getPool().length < this.poolIndexFlagToCheck) {
            this.pool.clear()
            this.game.setGameStrategy(new ProcessGameStrategy(this.game, GameStates.process))
        }
        return
    }
    fromPoolToRowWithSelect(rowIndex: number): procedureReportType<IGame> {
        throw new Error("Method not implemented.");
    }
    prepare(): procedureReportType<IGame> {
        return {
            success: false,
            message: reportMessagesLibrary.game.anotherStep,
            instance: this.game
        }
    }
    getEndsResult(): resultEndGameType {
        return {
        }
    }
    getGameStep(): IStateForGame {
        return this
    }
    getName(): GameStates {
        return this.name
    }
    addToPool(card: Icard, player: Iplayer): procedureReportType<IPool> {
        return {
            success: false,
            message: reportMessagesLibrary.game.anotherStep,
            instance: this.game.getPool()
        }
    }
    fromPoolToRow(): procedureReportType<IGame> {
        if (this.needToSelect) {
            return {
                success: false,
                message: reportMessagesLibrary.game.needToSelect,
                instance: this.game as IGame
            }
        }
        let checkedCardFromPool = this.pool.getPool()[this.poolIndexFlagToCheck]
        let indexRow = -1
        let currentCardsValue = -1
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            const indexOfLastCardInRow = this.rows[rowIndex].countOfCards() - 1
            if (this.rows[rowIndex].getRow()[indexOfLastCardInRow]!.getNominal() < checkedCardFromPool.card.getNominal()
                && this.rows[rowIndex].getRow()[indexOfLastCardInRow]!.getNominal() > currentCardsValue
            ) {
                indexRow = rowIndex
                currentCardsValue = this.rows[rowIndex].getRow()[indexOfLastCardInRow]!.getNominal()
            }
        }

        this.poolIndexFlagToCheck++
        this.nextStepOfState()
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this.game as IGame
        }
    }

}