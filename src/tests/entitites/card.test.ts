import { Card } from "../../Entities/Card/model"

const nominal = 5
const badPoints = 2

describe("Card is a class for playing item with number and bad points", () => {
    const card = new Card(nominal, badPoints)
    test('It has number and returns its', () => {
        expect(card.getNominal).toBeDefined()
        expect(card.getNominal()).toBe(nominal)
        expect(card.getNominal()).not.toBe(104)
    })
    test('It has bad points and returns its', () => {
        expect(card.getBadPoints).toBeDefined()
        expect(card.getBadPoints()).toBe(badPoints)
        expect(card.getBadPoints()).not.toBe(11)
    })
})