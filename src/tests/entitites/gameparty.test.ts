import { GameParty } from "../../Entities/GameParty/model"
import { Player } from "../../Entities/Player/model"
import { reportMessagesLibrary } from "../../consts/reportMessages"
import { playersIdGenerator } from "./helpers/playersIdGenerator"
import { playersInfoGenerator } from "./helpers/playersInfoGenerator"


const mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
const mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator())
const mockPlayer3 = new Player(playersInfoGenerator(), playersIdGenerator())
const mockPlayer4 = new Player(playersInfoGenerator(), playersIdGenerator())
const mockPlayer5 = new Player(playersInfoGenerator(), playersIdGenerator())

describe("GameParty is a one fight in game. It consists 2-4 players and deligates actions to features", () => {
    test("Helping playersInfoGenerator works correctly", () => {
        let playersInfo = playersInfoGenerator()
        expect(typeof playersInfo.rang).toBe("number")
        expect(typeof playersInfo.stats).toBe("object")
        expect(typeof playersInfo.name).toBe("string")
    })
    let GP = new GameParty("")
    beforeEach(() => {
        GP = new GameParty("")
    })
    test("GameParty has a identifier", () => {
        expect(GP.getGPid()).toBeDefined()
        expect(typeof GP.getGPid()).toBe("string")
    })
    test("GameParty has a ready status", () => {
        expect(GP.isReadyToStart()).toBe(false)
    })
    test("GameParty shows count of players", () => {
        expect(typeof GP.getCountOfPlayers()).toBe("number")
    })
    test("GameParty can sign about the game ready", () => {
        GP.addPlayer(mockPlayer)
        GP.addPlayer(mockPlayer2)
        expect(GP.isReadyToStart()).toBe(true)
    })
    test("GameParty can add newPlayers, but not more 4", () => {
        GP.addPlayer(mockPlayer)
        expect(GP.getCountOfPlayers()).toBe(1)
        GP.addPlayer(mockPlayer2)
        expect(GP.getCountOfPlayers()).toBe(2)
        GP.addPlayer(mockPlayer3)
        expect(GP.getCountOfPlayers()).toBe(3)
        GP.addPlayer(mockPlayer4)
        expect(GP.getCountOfPlayers()).toBe(4)
        let resultAddingPlayer = GP.addPlayer(mockPlayer5)
        expect(resultAddingPlayer.success).toBe(false)
    })
    test("GameParty can delete players, but not delete player not existing in GP", () => {
        GP.addPlayer(mockPlayer)
        GP.addPlayer(mockPlayer2)
        expect(GP.getCountOfPlayers()).toBe(2)
        GP.deletePlayer(mockPlayer.getId())
        expect(GP.getCountOfPlayers()).toBe(1)
        GP.deletePlayer(mockPlayer2.getId())
        expect(GP.getCountOfPlayers()).toBe(0)
        let result = GP.deletePlayer(mockPlayer3.getId())
        expect(result.success).toBe(false)
        expect(result.message).toBe(reportMessagesLibrary.GameParty.noThatPlayer)
    })
    test("If GameParty ready to start it can set start of the game", () => {
        expect(GP.isReadyToStart()).toBe(false)
        GP.addPlayer(mockPlayer)
        GP.addPlayer(mockPlayer2)
        expect(GP.isReadyToStart()).toBe(true)
        // Тестирования запуска игра не будет, пока не создастся соответствующая сущность
    })
    test("GameParty messages about a game starts or not", () => {
        expect(GP.isGameStarted()).toBe(false)
    })
    test("GameParty can start a game", () => {
        GP.setGameStarted()
        expect(GP.isGameStarted()).toBe(true)
    })
    test("GameParty is Full if it is full", () => {
        GP.addPlayer(mockPlayer)
        GP.addPlayer(mockPlayer2)
        GP.addPlayer(mockPlayer3)
        GP.addPlayer(mockPlayer4)
        expect(GP.isPartyFull()).toBe(true)
    })
})