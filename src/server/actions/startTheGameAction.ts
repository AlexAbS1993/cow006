import { gamesType, messageForSendFromServerEnum, theGameStartType } from "../../../types";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { webSocketProcedureReportType } from "../../Adds/Reports/webSocketReport.type";
import { IgameParty } from "../../Entities/GameParty/interface";
import { Iplayer } from "../../Entities/Player/interface";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { webSocketReportMessagesLibrary } from "../../consts/webSocketResponseMessage";
import ws from 'ws'
import { IUser } from "../entities/user/interface";
import {v4 as uuid} from 'uuid'
import { Game } from "../../Entities/Game/model";

export function startTheGameAction(parsedData: theGameStartType, gameParty: IgameParty, initiator: Iplayer, room: IUser[], games: gamesType): procedureReportType<null> {
    if (initiator.getId() !== gameParty.getLeader()!.getId()) {
        return {
            success: false,
            instance: null,
            message: reportMessagesLibrary.game.notALeader
        }
    }
    else {
        gameParty.setGameStarted()
        let gameId = uuid()
        games[gameId] = new Game(gameId, parsedData.data.mode, gameParty)
        games[gameId].prepare()
        for (let player of gameParty.getPlayers()){
            player.setInGame(true)
        }
        for (let user of room){
            user.setGameId(gameId)
            user.setInGame(true)
        }
        return {
            success: true,
            instance: null,
            message: reportMessagesLibrary.ok.okMessage
        }
    }
}