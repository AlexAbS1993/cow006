import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { GameStates } from "../../consts/rules";
import { Icard } from "../Card/interface";
import { Iplayer } from "../Player/interface";
import { IPool } from "../Pool/interface";
import { CheckingPooStateStrategy } from "./CheckingPoolStageStrategy";
import { IGame, IStateForGame, resultEndGameType } from "./interface";
import { Game } from "./model";

export class ProcessGameStrategy implements IStateForGame {
    private name: GameStates
    private game: Game
    constructor(game: Game, name: GameStates) {
        this.name = name
        this.game = game
    }
    fromPoolToRowWithSelect(rowIndex: number): procedureReportType<IGame> {
        return {
            success: false,
            message: reportMessagesLibrary.game.anotherStep,
            instance: this.game
        }
    }
    prepare(): procedureReportType<IGame> {
        return {
            success: false,
            message: reportMessagesLibrary.game.anotherStep,
            instance: this.game
        }
    }
    getEndsResult(): resultEndGameType {
        return {}
    }
    getGameStep(): IStateForGame {
        return this
    }
    getName(): GameStates {
        return this.name
    }
    addToPool(card: Icard, player: Iplayer): procedureReportType<IPool> {
        let resultOfPooling = this.getPool().addCard(card, player)
        if (resultOfPooling.success === false) {
            return resultOfPooling
        }
        else {
            let pool = this.getPool()
            if (pool.isAllSettled()) {
                this.game.setGameStrategy(new CheckingPooStateStrategy(this.game, GameStates.checking))
                let gameChangeStateResult: procedureReportType<IPool> = {
                    success: true,
                    instance: pool,
                    message: reportMessagesLibrary.game.switchToCheckPool
                }
                return gameChangeStateResult
            }
            return resultOfPooling
        }
    }
    fromPoolToRow(): procedureReportType<IGame> {
        return {
            success: false,
            message: reportMessagesLibrary.game.anotherStep,
            instance: this.game
        }
    }
    getPool() {
        return this.game.getPool()
    }
}