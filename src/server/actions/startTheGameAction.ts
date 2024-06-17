import { gamesType, messageForSendFromServerEnum, theGameStartType } from "../../../types";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { IgameParty } from "../../Entities/GameParty/interface";
import { Iplayer } from "../../Entities/Player/interface";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { IUser } from "../entities/user/interface";
import {v4 as uuid} from 'uuid'
import { Game } from "../../Entities/Game/model";
import { gameRules } from "../../consts/rules";

export function startTheGameAction(parsedData: theGameStartType, gameParty: IgameParty, initiator: Iplayer, room: IUser[], games: gamesType): procedureReportType<null> {
    if (initiator.getId() !== gameParty.getLeader()!.getId()) {
        return {
            success: false,
            instance: null,
            message: reportMessagesLibrary.GameParty.notALeader
        }
    }
    else if (gameParty.getPlayers().length < gameRules.minReadyToStartPlayers){
        return {
            success: false,
            instance: null,
            message: reportMessagesLibrary.GameParty.less2Player
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