import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { GameMods, GameStates, GameSteps } from "../../consts/rules"
import { Icard } from "../Card/interface"
import { IgameParty } from "../GameParty/interface"
import { Iplayer } from "../Player/interface"
import { IPool, poolCellType } from "../Pool/interface"
import { IRow } from "../Row/interface"
import { Istuff } from "../Stuff/interface"

type playersResultType = {
    name: string,
    id: string,
    badPoints: number,
    winner: boolean
}

export type resultEndGameType = {
    [key: string]: playersResultType
}

export interface IGame {
    getGameId(): string
    prepare(): procedureReportType<IGame>
    isReady(): boolean
    getPlayers(): Iplayer[]
    getMod(): GameMods
    getParty(): IgameParty
    getStuff(): Istuff
    getGameState(): GameStates
    setGameState(state: GameStates): void
    getGameStep(): GameSteps
    addToPool(card: Icard, player: Iplayer): procedureReportType<IPool>
    getPool(): IPool
    getRows(): IRow[]
    fromPoolToRow(): procedureReportType<IGame>
    fromPoolToRowWithSelect(rowIndex: number): procedureReportType<IGame>
    getEndsResult(): resultEndGameType
    setGameReady(value: boolean): void
    checkAllSettledToPullToRow(): boolean
    getBlock(): boolean
    setBlock(): void
    unblock(): void
    retake(): procedureReportType<IGame>
    needToRetake(): boolean
    getPoolingCell(): poolCellType|procedureReportType<IGame>
}

export interface IStateForGame {
    prepare(): procedureReportType<IGame>
    getEndsResult(): resultEndGameType
    getName(): GameStates
    addToPool(card: Icard, player: Iplayer): procedureReportType<IPool>
    fromPoolToRow(): procedureReportType<IGame>
    fromPoolToRowWithSelect(rowIndex: number): procedureReportType<IGame>
    getPoolingCell(): poolCellType|procedureReportType<IGame>
}
