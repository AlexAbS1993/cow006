import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { cardListCreator } from "../../Instruments/Creators/CardList.creator";
import { GameMods, GameStates, GameSteps } from "../../consts/rules";
import { Icard } from "../Card/interface";
import { IgameParty } from "../GameParty/interface";
import { Hand } from "../Hand/model";
import { Iplayer } from "../Player/interface";
import { IPool } from "../Pool/interface";
import { Pool } from "../Pool/model";
import { IRow } from "../Row/interface";
import { Row } from "../Row/model";
import { Istuff } from "../Stuff/interface";
import { Stuff } from "../Stuff/model";
import { PrepearGameStateStrategy } from "./PrepearingGameStateStrategy";
import { IGame, IStateForGame, resultEndGameType } from "./interface";

export class Game implements IGame {
    private readyGame: boolean
    private id: string
    private players: Iplayer[]
    private mode: GameMods
    private party: IgameParty
    private stuff: Istuff
    private state: GameStates
    private step: GameSteps
    limitOfCardInHand: number
    private rows: IRow[]
    private pool: IPool
    private stateStrategy: IStateForGame
    constructor(id: string, mode: GameMods, party: IgameParty) {
        this.readyGame = false
        this.id = id
        this.players = party.getPlayers()
        this.mode = mode
        this.party = party
        this.limitOfCardInHand = 10
        // В зависимости от установленного мода на игру формируется колода
        switch (mode) {
            case GameMods.classic: {
                this.stuff = new Stuff(cardListCreator(103))
                break
            }
            case GameMods.tactic: {
                let cardsCount = 10 * party.getPlayers().length + 4
                this.stuff = new Stuff(cardListCreator(cardsCount))
                break
            }
            default: {
                this.stuff = new Stuff(cardListCreator(103))
                break
            }
        }
        this.state = GameStates.prepearing
        this.stateStrategy = new PrepearGameStateStrategy(this, GameStates.prepearing)
        this.step = GameSteps.cardSelection
        this.rows = []
        // Определяется пул сыгранных карт по количеству игроков
        this.pool = new Pool(party.getPlayers().length)
    }

    setGameState(state: GameStates): void {
        this.state = state
        return
    }
    setGameReady(value: boolean): void {
        this.readyGame = value
        return
    }
    getGameId() {
        return this.id
    }
    prepare(): void {
        // this.stuff.shuffle()
        // for (let player of this.players) {
        //     let hand = new Hand(this.limitOfCardInHand)
        //     for (let i = 1; i <= this.limitOfCardInHand; i++) {
        //         hand.addCard(this.stuff.getUpCard() as Icard)
        //         this.stuff.discardUp()
        //     }
        //     player.takeHand(hand)
        // }
        // for (let j = 0; j < 4; j++) {
        //     this.rows[j] = new Row(this.stuff.getUpCard() as Icard)
        //     this.stuff.discardUp()
        // }
        // this.readyGame = true
        // this.state = GameStates.process
        this.stateStrategy.prepare()
    }
    isReady(): boolean {
        return this.readyGame
    }
    getPlayers(): Iplayer[] | null {
        return this.players
    }
    getMod(): GameMods {
        return this.mode
    }
    getParty(): IgameParty | null {
        return this.party
    }
    getStuff(): Istuff {
        return this.stuff
    }
    getGameState(): GameStates {
        return this.state
    }
    getGameStep(): GameSteps {
        return this.step
    }
    addToPool(card: Icard, player: Iplayer): procedureReportType<IPool> {
        return this.stateStrategy.addToPool(card, player)
    }
    getPool(): IPool {
        return this.pool
    }
    getRows(): IRow[] {
        return this.rows
    }
    fromPoolToRow(): procedureReportType<IGame> {
        return this.stateStrategy.fromPoolToRow()
    }
    getEndsResult(): resultEndGameType {
        return this.stateStrategy.getEndsResult()
    }
    setGameStrategy(gameStrategy: IStateForGame) {
        this.stateStrategy = gameStrategy
        return
    }
    checkAllSettledToPullToRow(): boolean {
        return this.getPool().isAllSettled()
    }
    // Только для тестов!!!
    __fakeRowsCreate(rows: IRow[]) {
        this.rows = rows
        return
    }
}