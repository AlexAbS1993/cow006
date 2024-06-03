import { createHmac } from 'node:crypto';
import { registrateDataType, registrationUserType } from '../../../types';
import ws from 'ws'

export function registrationAction(parsedData: registrateDataType, secretKey: string, registrationUsers: registrationUserType, webSocket: ws, wsId: string) {
    const { login, password } = parsedData.data
    const hash = createHmac('sha256', secretKey)
        .update(`${login}_${password}`)
        .digest('hex');
    if (registrationUsers[hash]) {
        webSocket.send("Already In system")
    }
    else {
        const loginHash = createHmac('sha256', secretKey)
            .update(`${login}`)
            .digest('hex');
        const passwordHash = createHmac('sha256', secretKey)
            .update(`${password}`)
            .digest('hex');
        registrationUsers[hash] = {
            login: loginHash, password: passwordHash, id: wsId
        }
    }
}