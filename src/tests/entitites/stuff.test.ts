import { Stuff } from "../../Entities/Stuff/model"
import { cardListCreator } from "../../Instruments/Creators/CardList.creator"

const expectedCountOfCard = 103
const anyRequiredCard = 55
const discardCardWithNum = 44

describe("Stuff is a stack of 103 cards. It can discard and show cards from itself", () => {
    // Создается колода из 103 карт
    const stuff = new Stuff(cardListCreator(expectedCountOfCard))
    // Колода для постоянного пересоздания и изменения
    let changabalStuff = {} as Stuff
    // Пустая колода для проверки работы дискарда
    let emptyStuff = new Stuff([])
    test("Stuff has a current number of card", () => {
        expect(stuff.getCountOfCard()).toBe(expectedCountOfCard)
    })
    test("Stuff can return and show the last card", () => {
        expect(stuff.getUpCard()!.getNominal()).toBe(expectedCountOfCard)
    })
    test("Stuff can show any required card", () => {
        expect(stuff.getCard(anyRequiredCard)!.getNominal()).toBe(anyRequiredCard)
        expect(stuff.getCard(anyRequiredCard)!.getBadPoints()).toBe(7)
    })
    beforeEach(() => {
        changabalStuff = new Stuff(cardListCreator(expectedCountOfCard))
    })
    test("Stuff can discard a card from up", () => {
        changabalStuff.discardUp()
        expect(changabalStuff.getCountOfCard()).toBe(expectedCountOfCard - 1)
        expect(changabalStuff.getUpCard()!.getNominal()).toBe(expectedCountOfCard - 1)
    })
    test("Stuff can discard a card from any place of stack", () => {
        changabalStuff.discard(discardCardWithNum)
        expect(changabalStuff.getCountOfCard()).toBe(expectedCountOfCard - 1)
        expect(changabalStuff.getUpCard()?.getNominal()).toBe(expectedCountOfCard)
        expect(changabalStuff.getCard(discardCardWithNum)).toBeNull()
    })
    test("Empty stuff returns itself when discarding", () => {
        expect(emptyStuff.getCountOfCard()).toBe(0)
        expect(emptyStuff.discardUp().getCountOfCard()).toBe(0)
    })
    test("Empty stuff returns null when trying to get up card", () => {
        expect(emptyStuff.getUpCard()).toBeNull()
        expect(emptyStuff.getCard(anyRequiredCard)).toBeNull()
    })
    test("Stuff can shuffle itself", () => {
        expect(stuff.getUpCard()!.getNominal()).toBe(expectedCountOfCard)
        stuff.shuffle()
        expect(stuff.getUpCard()!.getNominal()).not.toBe(expectedCountOfCard)
    })
})