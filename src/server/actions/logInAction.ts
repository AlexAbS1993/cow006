import { loginInDataType, messageForSendFromServerEnum, registrationUserType } from "../../../types";
import { createHmac } from 'node:crypto';
import ws from 'ws'
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { webSocketProcedureReportType } from "../../Adds/Reports/webSocketReport.type";
import { webSocketReportMessagesLibrary } from "../../Adds/Reports/webSocketResponseMessage";
import { IRegUser, IRegUserSelector } from "../../Entities/RegistratedUser/interface";

export async function logInAction(parsedData: loginInDataType, secretKey: string, registrationUsers: IRegUserSelector, webSocket: ws): Promise<procedureReportType<null>> {
    const { login, password } = parsedData.data
    const hash = createHmac('sha256', secretKey)
        .update(`${login}_${password}`)
        .digest('hex');
    let response = await registrationUsers.getRegUser(hash)
    let status = response.success
    let user = response.data as IRegUser
    if (status) {
        let id = user.getId()
        let report: webSocketProcedureReportType<{ token: string, login: string, id: string }> = {
            success: true,
            message: webSocketReportMessagesLibrary.successLogIn(),
            type: messageForSendFromServerEnum.successLogIn,
            data: {
                token: hash,
                login, id
            }
        }
        webSocket.send(JSON.stringify(report))
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: null
        }
    }
    else {
        let report: webSocketProcedureReportType = {
            success: false,
            message: webSocketReportMessagesLibrary.logInWrongDatas(),
            type: messageForSendFromServerEnum.logInWrongDatas
        }
        webSocket.send(JSON.stringify(report))
        return {
            success: false,
            message: reportMessagesLibrary.server.wrongLogInData,
            instance: null
        }
    }
}