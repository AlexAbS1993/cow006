import { Player } from "../../Entities/Player/model"
import { IPool } from "../../Entities/Pool/interface"
import { Pool } from "../../Entities/Pool/model"
import { cardListCreator } from "../../Instruments/Creators/CardList.creator"
import { reportMessagesLibrary } from "../../consts/reportMessages"
import { playersIdGenerator } from "./helpers/playersIdGenerator"
import { playersInfoGenerator } from "./helpers/playersInfoGenerator"

describe("Pool - сущность, хранящая карты от каждого из игроков. Это все карты, сыгранные в раунд. Внутри \
    pool массив сортирует карты по возрастанию, чтобы установить порядок расстановки карт по row", () => {
    let pool: IPool
    let player1 = new Player(playersInfoGenerator(), playersIdGenerator())
    let player2 = new Player(playersInfoGenerator(), playersIdGenerator())
    let cards = cardListCreator(103)
    beforeEach(() => {
        pool = new Pool(2)
    })
    test("У Pool есть массив, куда кладутся карты. Каждая карта занимает ячейку. Количество ячеек равно количесвут игроков", () => {
        expect(pool.getPool()).toBeDefined()
    })
    test("В ячейку Pool входит сама карта и игрок, сыгравший её", () => {
        pool.addCard(cards[10], player1)
        expect(pool.getPool()[0].card).toBeDefined()
        expect(pool.getPool()[0].player.getId()).toBe(player1.getId())
    })
    test("В Pool можно положить карту от игрока, причем только одну", () => {
        let successFullResult = pool.addCard(cards[50], player1)
        expect(successFullResult.success).toBe(true)
        expect(successFullResult.message).toBe(reportMessagesLibrary.ok.okMessage)
        let failedResult = pool.addCard(cards[40], player1)
        expect(failedResult.success).toBe(false)
        expect(failedResult.message).toBe(reportMessagesLibrary.game.playersCardHasAlredyWhere)
    })
    test("После того, как все игроки добавили свои карты, происходит раскрытие Pool и сортировка карт по возрастанию", () => {
        pool.addCard(cards[50], player1)
        expect(pool.isAllSettled()).toBe(false)
        pool.addCard(cards[4], player2)
        expect(pool.isAllSettled()).toBe(true)
        expect(pool.getPool()[0].player.getId()).toBe(player2.getId())
    })
    test("Pool самоочищается", () => {
        pool.addCard(cards[50], player1)
        pool.addCard(cards[4], player2)
        expect(pool.getCountOfPlaces().free).toBe(0)
        pool.clear()
        expect(pool.getCountOfPlaces().free).toBe(2)
    })
})