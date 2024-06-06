import { Icard } from "../../Entities/Card/interface"
import { Card } from "../../Entities/Card/model"
import { PenaltySet } from "../../Entities/PenaltySet/model"
import { Iplayer } from "../../Entities/Player/interface"

describe("Сущность PenaltySet хранит в себе карты, которые являются штрафными. Их игрок получает \
, когда кладёт 6 карту в ряд или заменяет ряд меньшей картой", () => {
    let penSetId = `testIDforSet`
    let mockPlayer = {
        getId() {
            return `testIDforPlayer`
        }
    } as Iplayer
    let penaltySet = new PenaltySet(penSetId, mockPlayer.getId())
    beforeEach(() => {
        penaltySet = new PenaltySet(penSetId, mockPlayer.getId())
    })
    test("PenaltySet имеет собственный id", () => {
        expect(penaltySet.getId()).toBe(penSetId)
    })
    test("PenaltySet включает в себя ID player, которому принадлежит", () => {
        expect(penaltySet.getPlayersId()).toBe(mockPlayer.getId())
    })
    test("PenaltySet имеет коллекцию карт", () => {
        expect(penaltySet.getCardSet()).toBeDefined()
    })
    test("PenaltySet возвращает количество карт в себе", () => {
        expect(penaltySet.getCountOfCard()).toBe(0)
    })
    test("PenaltySet способен добавлять в себя новые карты", () => {
        let card: Icard = new Card(1, 1)
        penaltySet.addCard(card)
        expect(penaltySet.getCountOfCard()).toBe(1)
    })
    test("PenaltySet способен самоочищаться", () => {
        let card: Icard = new Card(1, 1)
        penaltySet.addCard(card)
        penaltySet.clear()
        expect(penaltySet.getCountOfCard()).toBe(0)
    })
    test("PenaltySet способен самостоятельно считать количество штрафных очков в колекции карт", () => {
        let card: Icard = new Card(1, 1)
        let card2: Icard = new Card(5, 3)
        penaltySet.addCard(card)
        penaltySet.addCard(card2)
        expect(penaltySet.getPenaltyResult()).toBe(4)
    })
})