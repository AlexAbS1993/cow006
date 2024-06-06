// Статистика не реализована. В планах получение данных об игроках с сервера.
// Пока что это просто цифры 0 и 0

import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { IgameParty } from "../GameParty/interface"
import { Ihand } from "../Hand/interface"
import { IPenaltySet } from "../PenaltySet/interface"

type statsType = {
    wins: number,
    looses: number
}

export type playerInfoType = {
    name: string,
    rang: number,
    stats: statsType
}

// До момента создания сущности игры метод gameInfo будет возвращать unknown

export interface Iplayer {
    getInfo(): playerInfoType
    changeInfo(newInfo: playerInfoType): procedureReportType<Iplayer>
    // setStatistic(): Promise<procedureReportType<Iplayer>>
    getId(): string
    getHand(): Ihand
    takeHand(hand: Ihand): procedureReportType<Iplayer>
    cardsCount(): number
    // getCardFromHand(): Icard
    discardCardFromHand(nO: number): procedureReportType<Iplayer>
    inGame(): boolean
    setInGame(value: boolean): void
    getGameInfo(): null | playersGameInfoType
    defineGameInfo(gameInfo: IgameParty): procedureReportType<Iplayer>
    getPenaltySet(): IPenaltySet
    howPenaltyPoints(): number
}

export type playersGameInfoType = {
    gameId: string
    players: Iplayer[]
}