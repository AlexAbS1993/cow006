import { loginInDataType, registrationUserType } from "../../../types";
import { createHmac } from 'node:crypto';
import ws from 'ws'
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";

export function logInAction(parsedData: loginInDataType, secretKey: string, registrationUsers: registrationUserType, webSocket: ws): procedureReportType<null> {
    const { login, password } = parsedData.data
    const hash = createHmac('sha256', secretKey)
        .update(`${login}_${password}`)
        .digest('hex');
    if (registrationUsers[hash]) {
        webSocket.send(JSON.stringify({ token: hash }))
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: null
        }
    }
    else {
        webSocket.send("Неверные данные")
        return {
            success: false,
            message: reportMessagesLibrary.server.wrongLogInData,
            instance: null
        }
    }
}