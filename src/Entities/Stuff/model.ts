import { Icard } from "../Card/interface";
import { Istuff } from "./interface";

export class Stuff implements Istuff {
    private stuff: Icard[]
    constructor(list: Icard[]) {
        this.stuff = list
    }
    // Метод перетасовки. Взят из интернета
    shuffle(): void {
        let m = this.stuff.length, t, i;
        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            t = this.stuff[m];
            this.stuff[m] = this.stuff[i];
            this.stuff[i] = t;
        }
    }
    getStuff(): Icard[] {
        return this.stuff
    }
    getCard(nO: number): Icard | null {
        // !!! Только для тестирования
        return this.stuff.find((card: Icard) => card.getNominal() === nO) || null
    }
    // Взятие карты с верха колоды
    getUpCard(): Icard | null {
        // Вероятнее всего не будет ситуации, при которой будет искаться несуществующая карта
        return this.stuff[this.stuff.length - 1] || null
    }
    discard(nO: number): Istuff {
        this.stuff = this.stuff.filter(card => card.getNominal() !== nO)
        return this
    }
    // Удаление карты с верха колоды
    discardUp(): Istuff {
        this.stuff.pop()
        return this
    }
    getCountOfCard(): number {
        return this.stuff.length
    }
}