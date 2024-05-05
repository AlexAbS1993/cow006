import { Icard } from "./interface"

export class Card implements Icard{
    private nO: number
    private badPoints: number
    constructor(nO:number, badPoints: number){
        this.nO = nO
        this.badPoints = badPoints
    }
    getNominal(){
        return this.nO
    }
    getBadPoints(){
        return this.badPoints
    }
}