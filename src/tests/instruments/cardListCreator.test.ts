import { Card } from "../../Entities/Card/model"
import { cardListCreator } from "../../Instruments/Creators/CardList.creator"

const numberOfCard = 103
describe("cardListCreator creats a list of cards correctly", () => {
    const list = cardListCreator(numberOfCard)
    test("Every item of list is a Icard object", () => {
        list.forEach(card => {
            expect(card instanceof Card).toBe(true)
        })
    })
    test("Length of list is 103", () => {
        expect(list.length).toBe(103)
    })
})