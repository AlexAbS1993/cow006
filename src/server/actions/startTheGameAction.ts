import { messageForSendFromServerEnum, theGameStartType } from "../../../types";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { webSocketProcedureReportType } from "../../Adds/Reports/webSocketReport.type";
import { IgameParty } from "../../Entities/GameParty/interface";
import { Iplayer } from "../../Entities/Player/interface";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { webSocketReportMessagesLibrary } from "../../consts/webSocketResponseMessage";
import ws from 'ws'
import { IUser } from "../entities/user/interface";

export function startTheGameAction(parsedData: theGameStartType, game: IgameParty, initiator: Iplayer, webSocket: ws, room: IUser[]): procedureReportType<null> {
    if (initiator.getId() !== game.getLeader()!.getId()) {
        let report: webSocketProcedureReportType = {
            success: false,
            message: webSocketReportMessagesLibrary.gameStartedFailed(),
            type: messageForSendFromServerEnum.gameStarted
        }
        webSocket.send(JSON.stringify(report))
        return {
            success: false,
            instance: null,
            message: reportMessagesLibrary.game.notALeader
        }
    }
    else {
        game.setGameStarted()

        let report: webSocketProcedureReportType = {
            success: true,
            message: webSocketReportMessagesLibrary.gameStartedSuccessfully(),
            type: messageForSendFromServerEnum.gameStarted
        }
        for (let user of room) {
            user.getWS()!.send(JSON.stringify(report))
        }
        return {
            success: true,
            instance: null,
            message: reportMessagesLibrary.ok.okMessage
        }
    }
}