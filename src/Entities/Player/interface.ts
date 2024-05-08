// Статистика не реализована. В планах получение данных об игроках с сервера.
// Пока что это просто цифры 0 и 0

import { procedureReportType } from "../../Adds/Reports/procedureReport.type"
import { Icard } from "../Card/interface"
import { Ihand } from "../Hand/interface"

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
    getHand(): Ihand
    takeHand(hand:Ihand): procedureReportType<Iplayer>
    cardsCount():number
    // getCardFromHand(): Icard
    discardCardFromHand(nO: number): procedureReportType<Iplayer>
    // inGame():boolean
    // getGameInfo():null|unknown
    // defineGameInfo(gameInfo: unknown):procedureReportType<Iplayer>
}