import { Game } from "../../Entities/Game/model"
import {v4 as uuid} from 'uuid'
import { GameMods } from "../../consts/rules"
import { Player } from "../../Entities/Player/model"
import { playersInfoGenerator } from "../entitites/helpers/playersInfoGenerator"
import { playersIdGenerator } from "../entitites/helpers/playersIdGenerator"
import { GameParty } from "../../Entities/GameParty/model"
import { gameStartedInfoForResponseCreator } from "../../Adds/Reports/webSocketResponseDataCreators/gameStartedInfoForResponseCreator"

describe("Функция ResponseDataCreator создаёт специальный объект для будущей отправки через web socket", () => {
    let gameId = uuid()
    let party = new GameParty(gameId)
    party.addPlayer(new Player(playersInfoGenerator(), playersIdGenerator()))
    party.addPlayer(new Player(playersInfoGenerator(), playersIdGenerator()))
    party.addPlayer(new Player(playersInfoGenerator(), playersIdGenerator()))
    party.setLeaderLikeALeader(party.getPlayers()[0])
    let mockGame = new Game(gameId, GameMods.classic, party)
    mockGame.prepare()
    let dataObject = gameStartedInfoForResponseCreator(mockGame, party)
    test("Функция возвращает объект с указанными полями", () => {
        expect(dataObject.id).toBeDefined()
        expect(dataObject.gamePartyId).toBeDefined()
        expect(dataObject.players).toBeDefined()
        expect(dataObject.roomId).toBeDefined()
        expect(dataObject.rows).toBeDefined()
    })
    test("Возвращаемые поля игроков являются массивом и соответствуют количеству игроков, а также содержат информацию о них", () => {
        let players = dataObject.players
        expect(typeof players).toBe("object")
        expect(players.length).toBe(3)
        expect(Array.isArray(players)).toBe(true)
        expect(players[0].hand).toBeDefined()
        expect(players[0].id).toBeDefined()
        expect(players[0].isLeader).toBeDefined()
        expect(players[0].name).toBeDefined()
    })
    test("Возвращаемые руки игроков содержат объекты с номиналом и бэдпоинтс", () => {
        let randomHand = dataObject.players[1].hand
        expect(Array.isArray(randomHand)).toBe(true)
        expect(typeof randomHand).toBe('object')
        expect(randomHand[0].nominal).toBeDefined()
        expect(randomHand[0].badPoint).toBeDefined()
        expect(typeof randomHand[0].nominal).toBe('number')
    })
})