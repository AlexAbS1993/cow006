import { IWebSocketMessageController } from "./interface";

export class EmptyControllerStrategy implements IWebSocketMessageController {
    execute(): void {
        console.log("Нет стратегии")
    }
}