import { Icard } from "../../Entities/Card/interface"
import { Card } from "../../Entities/Card/model"

export function cardListCreator(countOfCard: number) {
    let result: Icard[] = []
    let currentNominal = 1
    while (currentNominal <= countOfCard) {
        result.push(new Card(currentNominal, howBadPoints(currentNominal)))
        currentNominal++
    }
    return result
}

export function howBadPoints(nO: number) {
    if (nO <= 0) {
        throw new Error("Требуется число выше 0")
    }
    if (nO * 10 % 10 !== 0) {
        throw new Error("Требуется целое число")
    }
    let stringifyied = `${nO}`
    if (stringifyied === "55") {
        return 7
    }
    else if (stringifyied[stringifyied.length - 1] === "5") {
        return 2
    }
    else if (stringifyied[stringifyied.length - 1] === "0") {
        return 3
    }
    else if (stringifyied[0] === stringifyied[1]) {
        return 5
    }
    return 1
}