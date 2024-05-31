import { EmptyControllerStrategy } from "./EmptyControllerStrategy";
import { IWebSocketMessageController } from "./interface";

export class WebSocketMessageController implements IWebSocketMessageController {
    private strategy: IWebSocketMessageController
    constructor() {
        this.strategy = new EmptyControllerStrategy()
    }
    defineStrategy(strategy: IWebSocketMessageController) {
        this.strategy = strategy
        return
    }
    execute(): void {
        this.strategy.execute()
    }
}