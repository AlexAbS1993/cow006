import { Icard } from "../Card/interface";
import { Istuff } from "./interface";

export class Stuff implements Istuff {
    private stuff: Icard[]
    constructor(list: Icard[]){
        this.stuff = list
    }
    getStuff(): Icard[] {
        return this.stuff
    }
    getCard(n0: number): Icard {
        // Вероятнее всего не будет ситуации, при которой будет искаться несуществующая карта
        return this.stuff.find((card:Icard) => card.getNominal() === n0) as Icard
    }
    getUpCard():Icard{
        return this.stuff[this.stuff.length - 1]
    }
    discard(n0: number): Istuff {
        throw new Error("Method not implemented.");
    }
    discardUp():Istuff {
        this.stuff.pop()
        return this
    }
    getCountOfCard(): number {
        return this.stuff.length
    }
}