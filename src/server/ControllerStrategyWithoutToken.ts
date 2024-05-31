import { expectedParsedDataType, messageFromClientTypes, registrationUserType } from "../../types";
import { IWebSocketMessageController } from "./interface";
import { createHmac } from 'node:crypto';
import ws from 'ws'

export class ControllerStrategyWithoutToken implements IWebSocketMessageController {
    messageData: expectedParsedDataType
    private secretKey: string
    private webSocket: ws
    private wsId: string
    private registrationUsers: registrationUserType
    constructor(data: expectedParsedDataType, secretKey: string, webSocket: ws, wsId: string, registrationUsers: registrationUserType) {
        this.messageData = data
        this.secretKey = secretKey
        this.webSocket = webSocket
        this.wsId = wsId
        this.registrationUsers = registrationUsers
    }
    execute(): void {
        switch (this.messageData.type) {
            case messageFromClientTypes.loginIn: {
                const { login, password } = this.messageData.data
                const hash = createHmac('sha256', this.secretKey)
                    .update(`${login}_${password}`)
                    .digest('hex');
                if (this.registrationUsers[hash]) {
                    this.webSocket.send(JSON.stringify({ token: hash }))
                }
                else {
                    this.webSocket.send("Неверные данные")
                }
                break
            }
            case messageFromClientTypes.registrate: {
                const { login, password } = this.messageData.data
                const hash = createHmac('sha256', this.secretKey)
                    .update(`${login}_${password}`)
                    .digest('hex');
                if (this.registrationUsers[hash]) {
                    this.webSocket.send("Already In system")
                }
                else {
                    const loginHash = createHmac('sha256', this.secretKey)
                        .update(`${login}`)
                        .digest('hex');
                    const passwordHash = createHmac('sha256', this.secretKey)
                        .update(`${password}`)
                        .digest('hex');
                    this.registrationUsers[hash] = {
                        login: loginHash, password: passwordHash, id: this.wsId
                    }
                }
                break
            }
            default: {
                console.log(`Попытка неавторизованного пользователя ${this.wsId} получить доступ к внутренним задачам по авторизации`)
                this.webSocket.send("Вы не авторизованы")
                break
            }
        }
        return
    }
}