import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { Iplayer } from "../Player/interface"

export interface IgameParty {
    getGPid(): string
    isReadyToStart(): boolean
    addPlayer(player: Iplayer): procedureReportType<IgameParty>
    increaseCountOfPlayer(): void
    decrieseCountOfPlayer(): void
    deletePlayer(id: string): procedureReportType<IgameParty>
    isGameStarted(): boolean
    setGameEnd(): void
    isPartyFull(): boolean
    setLeaderLikeALeader(player: Iplayer): void
    getLeader(): Iplayer | null
    getPlayers(): Iplayer[]
}

export enum playersFields {
    pl1 = "pl1", pl2 = "pl2", pl3 = "pl3", pl4 = "pl4"
}

export type listOfPlayers = {
    [key in playersFields]?: Iplayer
}