import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { GameStates } from "../../consts/rules";
import { Icard } from "../Card/interface";
import { Hand } from "../Hand/model";
import { Iplayer } from "../Player/interface";
import { IPool } from "../Pool/interface";
import { Row } from "../Row/model";
import { ProcessGameStrategy } from "./ProcessGameStateStrategy";
import { IGame, IStateForGame, resultEndGameType } from "./interface";
import { Game } from "./model";

export class PrepearGameStateStrategy implements IStateForGame {
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
        this.game.getStuff().shuffle()
        for (let player of this.game.getPlayers() as Iplayer[]) {
            let hand = new Hand(this.game.limitOfCardInHand)
            for (let i = 1; i <= this.game.limitOfCardInHand; i++) {
                hand.addCard(this.game.getStuff().getUpCard() as Icard)
                this.game.getStuff().discardUp()
            }
            player.takeHand(hand)
        }
        for (let j = 0; j < 4; j++) {
            this.game.getRows()[j] = new Row(this.game.getStuff().getUpCard() as Icard)
            this.game.getStuff().discardUp()
        }
        this.game.setGameReady(true)
        this.game.unblock()
        this.game.setGameState(GameStates.process)
        this.game.setGameStrategy(new ProcessGameStrategy(this.game, GameStates.process))
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
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
        return this.name as GameStates
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

}