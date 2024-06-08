import { Icard } from "../../Entities/Card/interface"
import { Player } from "../../Entities/Player/model"
import { Row } from "../../Entities/Row/model"
import { cardListCreator } from "../../Instruments/Creators/CardList.creator"
import { playersIdGenerator } from "./helpers/playersIdGenerator"
import { playersInfoGenerator } from "./helpers/playersInfoGenerator"

describe("Ряд включает в себя от 1 до 5 карт. Ряд рассматривается в качестве важной игровой единицы и следует игровым правилам", () => {
    let cardList = cardListCreator(103)
    let row = new Row(cardList[50])
    let player1 = new Player(playersInfoGenerator(), playersIdGenerator())
    let player2 = new Player(playersInfoGenerator(), playersIdGenerator())
    beforeEach(() => {
        cardList = cardListCreator(103)
        row = new Row(cardList[50])
    })
    test("Row хранит в себе массив из 5 ячеек, где первая при инициализации занята картой, а остальные имеют значение null", () => {
        let cardInCells: (Icard | null)[] = row.getRow()
        expect(cardInCells[0]).toBeDefined()
        expect(cardInCells[1]).toBeNull()
        expect(cardInCells[0]!.getNominal()).toBe(51)
    })
    test("Row может добавить в ячейки новые карты, причем делает это последовательно c указанием игрока, совершающего ход", () => {
        row.addCard(cardList[55], player1)
        row.addCard(cardList[60], player2)
        expect(row.countOfCards()).toBe(3)
        let cardInCells: (Icard | null)[] = row.getRow()
        expect(cardInCells[1]).toBeDefined()
        expect(cardInCells[1]!.getNominal()).toBe(56)
        expect(cardInCells[2]).toBeDefined()
        expect(cardInCells[2]!.getNominal()).toBe(61)
        expect(cardInCells[3]).toBeNull()
    })
    test("Row располагает методом replace для замещения ряда и передачи штрафных карт в penaltySet игрока", () => {
        row.addCard(cardList[55], player1)
        row.addCard(cardList[56], player1)
        row.addCard(cardList[57], player1)
        row.addCard(cardList[58], player1)
        row.replace(cardList[59], player1)
        expect(row.getRow()[0]).toBeDefined()
        expect(row.getRow()[1]).toBeNull()
        expect(player1.getPenaltySet().getCountOfCard()).toBe(5)
    })
    test("Row отвечает на запрос о последней занятой ячейке, отправляя карту и индекс этой ячейки", () => {
        row.addCard(cardList[55], player1)
        row.addCard(cardList[56], player1)
        row.addCard(cardList[57], player1)
        const expectingEqual = {
            card: cardList[56],
            index: 3
        }
        expect(row.cellsInfo().index).toBe(expectingEqual.index)
    })
})