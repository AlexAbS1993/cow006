import { Icard } from "../../Entities/Card/interface"
import { Card } from "../../Entities/Card/model"
import { Hand } from "../../Entities/Hand/model"
import { playerInfoType } from "../../Entities/Player/interface"
import { Player } from "../../Entities/Player/model"

const mockName = "Alex"
const mockHand = new Hand(10)
const mockCard = new Card(5, 2)
const mockCard2 = new Card(1, 1)
const mockCard3 = new Card(51, 1)
mockHand.addCard(mockCard)
mockHand.addCard(mockCard2)
mockHand.addCard(mockCard3)

describe("Player is a important part of the game. It has hand, info and gameInfo", () => {
    const playersInfo: playerInfoType = {
        name: mockName,
        rang: 0,
        stats: {
            wins: 0,
            looses: 0
        }
    }
    const player = new Player(playersInfo, "aa_33")
    test("Player have a hand", () => {
        expect(player.getHand()).toBeDefined()
    })
    test("Player can take stuff on his hand", () => {
        player.takeHand(mockHand)
        expect(player.cardsCount()).toBe(3)
    })
    test("Player have an info object within", () => {
        expect(player.getInfo()).toBeDefined()
        expect(player.getInfo().name).toBe(mockName)
    })
    test("Player can discard a card from hand", () => {
        player.discardCardFromHand(1)
        expect(player.cardsCount()).toBe(2)
        expect(mockHand.__getHand().findIndex((card: Icard) => card.getNominal() === 1)).toBe(-1)
    })
    test("Player can change info about itself", () => {
        let newPlayerInformation: playerInfoType = {
            name: "Alex",
            rang: 100,
            stats: {
                wins: 50,
                looses: 0
            }
        }
        player.changeInfo(newPlayerInformation)
        expect(player.getInfo().rang).toBe(100)
        expect(player.getInfo().stats.wins).toBe(50)
    })
    test("Player can be in game and out of it", () => {
        expect(player.inGame()).toBe(false)
        player.setInGame(true)
        expect(player.inGame()).toBe(true)
        player.setInGame(false)
        expect(player.inGame()).toBe(false)
    })
    // Тестирование об игровой информации не реализовано до создания сущности по Игре
})