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
    getCard(nO: number): Icard|undefined {     
        // !!! Только для тестирования
        return this.stuff.find((card:Icard) => card.getNominal() === nO)
    }
    getUpCard():Icard{
         // Вероятнее всего не будет ситуации, при которой будет искаться несуществующая карта
        return this.stuff[this.stuff.length - 1]
    }
    discard(nO: number): Istuff {
        if(this.isCardAvailable()){
            this.stuff = this.stuff.filter(card => card.getNominal() !== nO)
        }
        return this
    }
    discardUp():Istuff {
        if (this.isCardAvailable()){
            this.stuff.pop()
        }
        return this
    }
    getCountOfCard(): number {
        return this.stuff.length
    }
    private isCardAvailable(){
        return this.getCountOfCard() > 0
    }
}