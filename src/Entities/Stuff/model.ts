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
    getCard(nO: number): Icard|null {     
        // !!! Только для тестирования
        return this.stuff.find((card:Icard) => card.getNominal() === nO)||null
    }
    getUpCard():Icard|null{
         // Вероятнее всего не будет ситуации, при которой будет искаться несуществующая карта
        return this.stuff[this.stuff.length - 1] || null
    }
    discard(nO: number): Istuff {
        this.stuff = this.stuff.filter(card => card.getNominal() !== nO)
        return this
    }
    discardUp():Istuff {
        this.stuff.pop()
        return this
    }
    getCountOfCard(): number {
        return this.stuff.length
    }
}