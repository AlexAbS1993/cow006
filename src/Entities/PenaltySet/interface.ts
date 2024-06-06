import { Icard } from "../Card/interface"

export interface IPenaltySet {
    getId(): string
    getPlayersId(): string
    getCardSet(): Icard[]
    getCountOfCard(): number
    addCard(card: Icard): void
    clear(): void
    getPenaltyResult(): number
}