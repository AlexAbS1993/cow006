import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { Icard } from "../../Entities/Card/interface";
import { IGame } from "../../Entities/Game/interface";
import { Iplayer } from "../../Entities/Player/interface";
import { IPool } from "../../Entities/Pool/interface";

export function playerMakesTurn(player: Iplayer, card: Icard, game: IGame): procedureReportType<IPool>{
    return  game.addToPool(card, player)
}