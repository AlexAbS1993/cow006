import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { GameStates } from "../../consts/rules";
import { Icard } from "../Card/interface";
import { Iplayer } from "../Player/interface";
import { IPool } from "../Pool/interface";
import { IGame, IStateForGame, resultEndGameType } from "./interface";
import { Game } from "./model";

export class ProcessGameStrategy implements IStateForGame {
    private name: GameStates
    private game: Game
    constructor(game: Game, name: GameStates) {
        this.name = name
        this.game = game
    }
    prepare(): void {
        return
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
        return this.getPool().addCard(card, player)
    }
    fromPoolToRow(): procedureReportType<IGame> {

    }
    getPool() {
        return this.game.getPool()
    }
}