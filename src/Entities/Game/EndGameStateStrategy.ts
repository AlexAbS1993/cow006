import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages"
import { GameStates } from "../../consts/rules"
import { Icard } from "../Card/interface"
import { Iplayer } from "../Player/interface"
import { IPool } from "../Pool/interface"
import { IGame, IStateForGame, resultEndGameType } from "./interface"

export class EndGameStrategy implements IStateForGame {
    private name: GameStates
    private game: IGame
    constructor(game: IGame, name: GameStates) {
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
    addToPool(card: Icard, player: Iplayer): procedureReportType<IPool> {
        return {
            success: false,
            message: reportMessagesLibrary.game.anotherStep,
            instance: this.game.getPool()
        }
    }
    fromPoolToRow(): procedureReportType<IGame> {
        return {
            success: false,
            message: reportMessagesLibrary.game.anotherStep,
            instance: this.game
        }
    }
    getEndsResult(): resultEndGameType {
        let result: resultEndGameType = {}
        let players: Iplayer[] = this.game.getPlayers() as Iplayer[]
        for (let player of players) {
            let badPoints = player.getPenaltySet().getPenaltyResult()
            result[player.getId()] = {
                id: player.getId(),
                name: player.getInfo().name,
                badPoints,
                winner: false
            }
        }
        let minPoints = 999
        let winnerId = ``
        for (let player in result) {
            if (minPoints > result[player].badPoints) {
                minPoints = result[player].badPoints
                winnerId = result[player].id
            }
        }
        for (let player of players) {
            if (player.getId() === winnerId) {
                result[player.getId()].winner = true
            }
        }
        return result
    }
    getGameStep(): IStateForGame {
        return this
    }
    getName(): GameStates {
        return this.name as GameStates
    }
}