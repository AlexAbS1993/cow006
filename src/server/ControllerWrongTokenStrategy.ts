import { IWebSocketMessageController } from "./interface";
import ws from 'ws'

export class ControllerWrongTokenStrategy implements IWebSocketMessageController {
    private webSocket: ws
    constructor(webSocket: ws) {
        this.webSocket = webSocket
    }
    execute(): void {
        this.webSocket.send("Unauthorazed")
        return
    }
}