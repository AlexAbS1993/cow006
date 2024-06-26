import { createHmac } from 'node:crypto';
import { messageForSendFromServerEnum, registrateDataType, registrationUserType } from '../../../types';
import ws from 'ws'
import { webSocketProcedureReportType } from '../../Adds/Reports/webSocketReport.type';
import { webSocketReportMessagesLibrary } from '../../consts/webSocketResponseMessage';

export function registrationAction(parsedData: registrateDataType, secretKey: string, registrationUsers: registrationUserType, webSocket: ws, wsId: string) {
    const { login, password } = parsedData.data
    // Создаём хэш для логин_пароль
    const hash = createHmac('sha256', secretKey)
        .update(`${login}_${password}`)
        .digest('hex');
    if (registrationUsers[hash]) {
        let report: webSocketProcedureReportType = {
            success: false,
            message: webSocketReportMessagesLibrary.alreadyRegistred(),
            type: messageForSendFromServerEnum.alreadyRegistred
        }
        webSocket.send(JSON.stringify(report))
    }
    else {
        // Создание хэша для записи в локальное хранилище
        const loginHash = createHmac('sha256', secretKey)
            .update(`${login}`)
            .digest('hex');
        const passwordHash = createHmac('sha256', secretKey)
            .update(`${password}`)
            .digest('hex');
        registrationUsers[hash] = {
            login: loginHash, password: passwordHash, id: wsId
        }
        let report: webSocketProcedureReportType = {
            success: true,
            message: webSocketReportMessagesLibrary.successRegistred(),
            type: messageForSendFromServerEnum.successRegistred
        }
        webSocket.send(JSON.stringify(report))
    }
}