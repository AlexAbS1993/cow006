import {v4 as uuid} from 'uuid'
import { Game } from '../../../Entities/Game/model'
import { Player } from '../../../Entities/Player/model'
import { GameParty } from '../../../Entities/GameParty/model'
import { playersIdGenerator } from '../helpers/playersIdGenerator'
import { playersInfoGenerator } from '../helpers/playersInfoGenerator'
import { GameMods, GameStates } from '../../../consts/rules'
import { PrepearGameStateStrategy } from '../../../Entities/Game/PrepearingGameStateStrategy'
import { reportMessagesLibrary } from '../../../consts/reportMessages'
import { ProcessGameStrategy } from '../../../Entities/Game/ProcessGameStateStrategy'
import { Card } from '../../../Entities/Card/model'
import { howBadPoints } from '../../../Instruments/Creators/CardList.creator'

describe("Игровые стратегии заменяют друг друга для правильной работы методов", () => {
    let mockId = uuid()
    let classicMode:GameMods = GameMods.classic
    let mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockParty = new GameParty(uuid())
    mockParty.addPlayer(mockPlayer)
    mockParty.addPlayer(mockPlayer2)
    mockParty.setLeaderLikeALeader(mockPlayer)
    let classicGame = new Game(mockId, classicMode, mockParty)
    test("Игра запускается в состоянии prepare", () => {
        expect(classicGame.getGameState()).toBe(GameStates.prepearing)
    })
    test("состояние prepare может использовать только метод prepare", () => {
        let prepareState = new PrepearGameStateStrategy(classicGame, GameStates.prepearing)
        let wrongResult = prepareState.getEndsResult()
        expect(wrongResult).toEqual({})
        let noPoolResult = prepareState.fromPoolToRow()
        expect(noPoolResult.success).toBe(false)
        let successResult = prepareState.prepare()
        expect(successResult.success).toBe(true)
        expect(successResult.message).toBe(reportMessagesLibrary.game.switchToProcess)
    })
    test("Игра меняет свое состояние на process после подготовки",() => {
        expect(classicGame.getGameState()).toBe(GameStates.process)
    })
    test("Игра в состоянии process не может вызвать метод prepare", () => {
        let processState = new ProcessGameStrategy(classicGame, GameStates.process)
        let noPrepareResult = processState.prepare()
        expect(noPrepareResult.success).toBe(false)
        let card1 = new Card(5, howBadPoints(5))
        let card2 = new Card(6, howBadPoints(6))
        processState.addToPool(card1, mockPlayer)
        let successResult = processState.addToPool(card2, mockPlayer2)
        expect(successResult.success).toBe(true)
        let wrongResult = processState.addToPool(card2, mockPlayer2)
        expect(wrongResult.success).toBe(false)
        expect(classicGame.getGameState()).toBe(GameStates.checking)
    })
})