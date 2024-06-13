import { Card } from "../../Entities/Card/model"
import { Hand } from "../../Entities/Hand/model"
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages"
const cardsLimitInHand = 10

describe("A Hand is a players cards in a game. It must discard and get ones",() => {
    const playersHand = new Hand(cardsLimitInHand)
    test("Hand can add a new card", () => {
        expect(playersHand.countOfCards()).toBe(0)
        playersHand.addCard(new Card(1, 1))
        expect(playersHand.countOfCards()).toBe(1)
        playersHand.addCard(new Card(22, 2))
        expect(playersHand.countOfCards()).toBe(2)
    })
    test("Hand can discard", () => {
        playersHand.discard(1)
        expect(playersHand.countOfCards()).toBe(1)
    })
    test("Hand returns a specified dataObject", () => {
       let result = playersHand.addCard(new Card(9, 1))
       expect(result.success).toBe(true)
       expect(result.message).toBe(reportMessagesLibrary.ok.okMessage)
    })
    test("Hand returns a rigth message about procedures fail", () => {
        let result = playersHand.discard(99)
        expect(result.success).toBe(false)
        expect(result.message).toBe(reportMessagesLibrary.Hand.noRequiredCardInHand)
        for(let i = 20; i < 32; i++){
            playersHand.addCard(new Card(i, 1))
        }
        let overLimitWaiting = playersHand.addCard(new Card(44,3))
        expect(overLimitWaiting.message).toBe(reportMessagesLibrary.Hand.overLimit)
        expect(playersHand.countOfCards()).toBe(cardsLimitInHand)
    })
})