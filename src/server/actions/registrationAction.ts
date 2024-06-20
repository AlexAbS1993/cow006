import { createHmac } from 'node:crypto';
import { messageForSendFromServerEnum, registrateDataType, registrationUserType, usersType } from '../../../types';
import ws from 'ws'
import { webSocketProcedureReportType } from '../../Adds/Reports/webSocketReport.type';
import { webSocketReportMessagesLibrary } from '../../Adds/Reports/webSocketResponseMessage';
import { User } from '../entities/user/model';

export function registrationAction(parsedData: registrateDataType, users: usersType, secretKey: string, registrationUsers: registrationUserType, webSocket: ws, wsId: string) {
    const { login, password } = parsedData.data
    if (login.length < 1 || password.length < 3){
            let report: webSocketProcedureReportType = {
            success: false,
            message: webSocketReportMessagesLibrary.registrationValidationError(),
            type: messageForSendFromServerEnum.validationRegistrationError
        }
        webSocket.send(JSON.stringify(report))
        return
    }
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
        users[wsId] = new User(wsId, login)
        let report: webSocketProcedureReportType = {
            success: true,
            message: webSocketReportMessagesLibrary.successRegistred(),
            type: messageForSendFromServerEnum.successRegistred
        }
        webSocket.send(JSON.stringify(report))
    }
}