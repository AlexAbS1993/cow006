import { Icard } from "../Card/interface";

export interface Istuff {
    getStuff(): Icard[]
    getCard(n0: number): Icard
    discard(n0: number): Istuff
    getCountOfCard(): number
    getUpCard():Icard
    discardUp():Istuff
}