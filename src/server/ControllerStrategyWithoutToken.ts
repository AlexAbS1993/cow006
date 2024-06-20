import { expectedParsedDataType, messageFromClientTypes, registrationUserType, usersType } from "../../types";
import { logInAction } from "./actions/logInAction";
import { registrationAction } from "./actions/registrationAction";
import { IWebSocketMessageController } from "./interface";
import ws from 'ws'

export class ControllerStrategyWithoutToken implements IWebSocketMessageController {
    messageData: expectedParsedDataType
    private secretKey: string
    private webSocket: ws
    private wsId: string
    private registrationUsers: registrationUserType
    private users: usersType
    constructor(data: expectedParsedDataType, secretKey: string, webSocket: ws, wsId: string, registrationUsers: registrationUserType, users: usersType) {
        this.messageData = data
        this.secretKey = secretKey
        this.webSocket = webSocket
        this.wsId = wsId
        this.registrationUsers = registrationUsers
        this.users = users
    }
    execute(): void {
        switch (this.messageData.type) {
            case messageFromClientTypes.loginIn: {
                logInAction(this.messageData, this.secretKey, this.registrationUsers, this.webSocket)
                break
            }
            case messageFromClientTypes.registrate: {
                registrationAction(this.messageData, this.users, this.secretKey, this.registrationUsers, this.webSocket, this.wsId)
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