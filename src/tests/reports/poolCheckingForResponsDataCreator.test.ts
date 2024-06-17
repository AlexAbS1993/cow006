import { poolCheckingForResponsDataCreator } from "../../Adds/Reports/webSocketResponseDataCreators/poolCheckedForResponse"
import { Game } from "../../Entities/Game/model"
import { GameParty } from "../../Entities/GameParty/model"
import { Player } from "../../Entities/Player/model"
import { GameMods } from "../../consts/rules"
import { playersIdGenerator } from "../entitites/helpers/playersIdGenerator"
import { playersInfoGenerator } from "../entitites/helpers/playersInfoGenerator"

describe("poolCheckingForResponsDataCreator создает объект для отчёта по экшену из pool в row", () => {
    let mockId = 'mockGame-01'
    let mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator())
    let gp = new GameParty('gp-001')
    gp.addPlayer(mockPlayer)
    gp.addPlayer(mockPlayer2)
    let mockGame = new Game(mockId, GameMods.tactic, gp)
    mockGame.prepare()
    let players1randomCard = mockPlayer.getHand().__getHand()[0]
    let result = poolCheckingForResponsDataCreator(mockGame, mockPlayer, players1randomCard)
    test("poolCheckingForResponsDataCreator возвращает объект с заданными полями", () => {
        expect(result.cardN).toBeDefined()
        expect(result.playersId).toBeDefined()
        expect(result.rows).toBeDefined()
    })
    test("poolCheckingForResponsDataCreator возвращает объект с полями правильных типов", () => {
        expect(typeof result.cardN).toBe("number")
        expect(typeof result.playersId).toBe("string")
        expect(typeof result.rows).toBe("object")
        expect(Array.isArray(result.rows)).toBe(true)
    })
    test("Функция возвращает ожидаемые значения", () => {
        expect(result.cardN).toBe(players1randomCard.getNominal())
        expect(result.playersId).toBe(mockPlayer.getId())
        expect(result.rows[0][0]?.nominal).toBe(mockGame.getRows()[0].getRow()[0]?.getNominal())
    })
})