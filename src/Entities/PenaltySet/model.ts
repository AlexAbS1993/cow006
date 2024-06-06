import { Icard } from "../Card/interface";
import { IPenaltySet } from "./interface";

export class PenaltySet implements IPenaltySet {
    private id: string
    private playersId: string
    private cardSet: Icard[]
    constructor(id: string, playersId: string) {
        this.id = id
        this.playersId = playersId
        this.cardSet = []
    }
    getPenaltyResult(): number {
        return this.cardSet.reduce((prev: number, current: Icard) => {
            return current.getBadPoints() + prev
        }, 0)
    }
    getCardSet(): Icard[] {
        return this.cardSet
    }
    getId(): string {
        return this.id
    }
    getPlayersId(): string {
        return this.playersId
    }
    getCountOfCard(): number {
        return this.cardSet.length
    }
    addCard(card: Icard) {
        this.cardSet.push(card)
        return
    }
    clear() {
        this.cardSet = []
        return
    }
}