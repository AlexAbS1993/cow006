import { Iplayer } from './../../Entities/Player/interface';
import { v4 as uuid } from 'uuid'
import { Player } from '../../Entities/Player/model'
import { playersInfoGenerator } from './helpers/playersInfoGenerator'
import { playersIdGenerator } from './helpers/playersIdGenerator'
import { GameParty } from '../../Entities/GameParty/model'
import { Stuff } from '../../Entities/Stuff/model';
import { Icard } from '../../Entities/Card/interface';
import { Card } from '../../Entities/Card/model';
import { IRow } from '../../Entities/Row/interface';
import { Row } from '../../Entities/Row/model';
import { howBadPoints } from '../../Instruments/Creators/CardList.creator';
import { IPool } from '../../Entities/Pool/interface';
import { resultEndGameType } from '../../Entities/Game/interface';
import { Game } from '../../Entities/Game/model';
import { GameMods, GameStates } from '../../consts/rules';
import { procedureReportType } from '../../Adds/Reports/procedureReport.type';
import { reportMessagesLibrary } from '../../consts/reportMessages';

describe("Сущность Game хранит в себе все данные о текущей партии. В неё будет включен список игроков \
колода и игровые полосы, заполняемые по особым правилам", () => {
    let mockId = uuid()
    let mockId2 = uuid()
    let classicMode = GameMods.classic
    let tactikMode = GameMods.tactic
    let mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockParty = new GameParty(uuid())
    mockParty.addPlayer(mockPlayer)
    mockParty.addPlayer(mockPlayer2)
    mockParty.setLeaderLikeALeader(mockPlayer)
    let classicGame = new Game(mockId, classicMode, mockParty)
    let tacticGame = new Game(mockId2, tactikMode, mockParty)
    beforeEach(() => {
        mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
        mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator())
        mockParty = new GameParty(uuid())
        mockParty.addPlayer(mockPlayer)
        mockParty.addPlayer(mockPlayer2)
        mockParty.setLeaderLikeALeader(mockPlayer)
        classicGame = new Game(mockId, classicMode, mockParty)
        tacticGame = new Game(mockId2, tactikMode, mockParty)
    })
    test("Игра имеет статус готовности и неготовности", () => {
        expect(classicGame.isReady()).toBe(false)
        expect(tacticGame.isReady()).toBe(false)
    })
    test("Игра содержит список игроков", () => {
        expect(classicGame.getPlayers().length).toBe(2)
    })
    test("Игра хранит данные по моду", () => {
        expect(classicGame.getMod()).toBe(classicMode)
        expect(tacticGame.getMod()).toBe(tactikMode)
    })
    test("Игра хранит в себе данные по party", () => {
        expect(classicGame.getParty()).toBeDefined()
        expect(classicGame.getParty().getLeader()!.getId()).toBe(mockPlayer.getId())
    })
    test("У игры есть колода", () => {
        expect(classicGame.getStuff() instanceof Stuff).toBe(true)
        expect(classicGame.getStuff().getCountOfCard()).toBe(103)
        expect(tacticGame.getStuff().getCountOfCard()).toBe(24)
    })
    test("У игры есть 4 состояния: ПОДГОТОВКА, процесс, распределение и конец игры", () => {
        expect(classicGame.getGameState()).toBe("prepearing")
    })
    test("Игра запускается и совершает подготовительные действия", () => {
        classicGame.prepare()
        tacticGame.prepare()
        let players: Iplayer[] = classicGame.getPlayers()
        for (let player of players) {
            expect(player.getHand().countOfCards()).toBe(10)
        }
        let rows = classicGame.getRows()
        for (let row of rows) {
            expect(row.countOfCards()).toBe(1)
        }
        expect(classicGame.getStuff().getCountOfCard()).toBe(79)
        expect(classicGame.isReady()).toBe(true)
        expect(tacticGame.getStuff().getCountOfCard()).toBe(0)
        expect(tacticGame.isReady()).toBe(true)
    })
    test("У игры есть 4 состояния: подготовка, ПРОЦЕСС, распределение и конец игры", () => {
        classicGame.prepare()
        expect(classicGame.getGameState()).toBe("process")
    })
    test("У игры есть пул выбора карт от игроков, участвующих в игре", () => {
        classicGame.prepare()
        let randomCard: Icard = new Card(1, 1)
        classicGame.addToPool(randomCard, mockPlayer)
        expect(classicGame.getPool().getPool().length).toBe(1)
    })
    test("Игра распределяет пул карт от игроков по возрастанию и очищает его после распределения карт по rows", () => {
        classicGame.prepare()
        let randomCard1: Icard = new Card(1, 1)
        let randomCard2: Icard = new Card(2, 1)
        let pool  = classicGame.getPool()
        classicGame.addToPool(randomCard2, mockPlayer)
        classicGame.addToPool(randomCard1, mockPlayer2)
        expect(pool.getPool()[0].card.getNominal()).toBe(1)
        expect(pool.getPool()[0].player.getInfo().name).toBe(mockPlayer2.getInfo().name)
        expect(pool.getPool()[1].card.getNominal()).toBe(2)
    })
    test("Игра включает в себя 4 row с начальными картами на старте", () => {
        classicGame.prepare()
        const rows: IRow[] = classicGame.getRows()
        expect(rows.length).toBe(4)
        expect(rows[0].countOfCards()).toBe(1)
    })
    test("Игра не допускает добавления карты в пул дважды одним игроком", () => {
        classicGame.prepare()
        let randomCard1: Icard = new Card(1, 1)
        let randomCard2: Icard = new Card(2, 1)
        let randomCard3: Icard = new Card(3, 1)
        classicGame.addToPool(randomCard2, mockPlayer)
        classicGame.addToPool(randomCard1, mockPlayer2)
        let failedAdding = classicGame.addToPool(randomCard3, mockPlayer2)
        expect(failedAdding.success).toBe(false)
    })
    test("Игра распределяет добавленные карты в Pool по Row. После распределения \
        карты удаляются из Pool", () => {
         classicGame.prepare()
        let row1 = new Row(new Card(5, 1))
        let row2 = new Row(new Card(25, howBadPoints(25)))
        let row3 = new Row(new Card(55, howBadPoints(55)))
        let row4 = new Row(new Card(88, howBadPoints(88)))
        classicGame.__fakeRowsCreate([row4, row2, row3, row1])
        classicGame.addToPool(new Card(9, howBadPoints(9)), mockPlayer)
        classicGame.addToPool(new Card(99, howBadPoints(99)), mockPlayer2)
        if (classicGame.getPool().isAllSettled()) {
            let result: procedureReportType<any> = {
                success: true,
                message:"ok",
                instance: this
            }
            while(result.success===true){
                result = classicGame.fromPoolToRow()
            }
        }
        let pool: IPool = classicGame.getPool()
        expect(pool.isAllSettled()).toBe(false)
        expect(pool.getCountOfPlaces().free).toBe(2)
        let rows: IRow[] = classicGame.getRows()
        expect(rows[3].countOfCards()).toBe(2)
        expect(rows[2].countOfCards()).toBe(1)
        expect(rows[0].countOfCards()).toBe(2)
    })
    test("Игра проверяет, остались ли у игроков карты на руках и, или раздаёт новые карты \
        ,или подготавливается к концу игры", () => {
            classicGame.prepare()
            let row1 = new Row(new Card(5, 1))
            let row2 = new Row(new Card(25, howBadPoints(25)))
            let row3 = new Row(new Card(55, howBadPoints(55)))
            let row4 = new Row(new Card(88, howBadPoints(88)))
            classicGame.__fakeRowsCreate([row4, row2, row3, row1])
            classicGame.addToPool(new Card(9, howBadPoints(9)), mockPlayer)
            classicGame.addToPool(new Card(99, howBadPoints(99)), mockPlayer2)
            //@ts-ignore
            mockPlayer.getHand().__clearHand()
            //@ts-ignore
            mockPlayer2.getHand().__clearHand()
            if (classicGame.getPool().isAllSettled()) {
                let result: procedureReportType<any> = {
                    success: true,
                    message:"ok",
                    instance: this
                }
                while(result.success===true){
                    result = classicGame.fromPoolToRow()
                }
            }
            expect(classicGame.getPlayers()[0].getHand().countOfCards()).toBe(10)
            expect(classicGame.getPlayers()[1].getHand().countOfCards()).toBe(10)
    })
    test("Game после объявления конца игры подсчитывает результаты и выдает сводную таблицу", () => {
        classicGame.prepare()
        classicGame.__fakeEndGame()
        mockPlayer.getPenaltySet().addCard(new Card(11, howBadPoints(11)))
        mockPlayer.getPenaltySet().addCard(new Card(5, howBadPoints(5)))
        let result: resultEndGameType = classicGame.getEndsResult()
        for (let playerStat in result) {
            if (result[playerStat].id === mockPlayer.getId()) {
                expect(result[playerStat].badPoints).toBe(howBadPoints(11)+howBadPoints(5))
            }
            else {
                expect(result[playerStat].winner).toBe(true)
            }
        }
    })
    test("При передаче из Pool в Row карта удаляется из hand игрока", () => {
        classicGame.prepare()
        let randomPlayersCard = classicGame.getPlayers()[0].getHand().__getHand()[0]
        let randomPlayers2Card = classicGame.getPlayers()[1].getHand().__getHand()[0]
        let row1 = new Row(new Card(5, 1))
        let row2 = new Row(new Card(25, howBadPoints(25)))
        let row3 = new Row(new Card(55, howBadPoints(55)))
        let row4 = new Row(new Card(88, howBadPoints(88)))
        classicGame.__fakeRowsCreate([row4, row2, row3, row1])
        classicGame.addToPool(randomPlayersCard, classicGame.getPlayers()[0])
        classicGame.addToPool(randomPlayers2Card, classicGame.getPlayers()[1])
        expect(classicGame.getGameState()).toBe(GameStates.checking)
        let result1 = classicGame.fromPoolToRow()
        if (result1.message === reportMessagesLibrary.game.needToSelect){
            classicGame.fromPoolToRowWithSelect(0)
        }
        let result2 = classicGame.fromPoolToRow()
        if (result2.message === reportMessagesLibrary.game.needToSelect){
            classicGame.fromPoolToRowWithSelect(0)
        }
        expect(classicGame.getGameState()).toBe(GameStates.process)
        expect(classicGame.getPlayers()[0].cardsCount()).toBe(9)
        expect(classicGame.getPlayers()[1].cardsCount()).toBe(9)
    })
    describe("Game правильно работает при нескольких сценариях", () => {
        test("Правильно заменяет выбранную линию", () => {
            classicGame.prepare()
            let row1 = new Row(new Card(5, 1))
            let row2 = new Row(new Card(25, howBadPoints(25)))
            let row3 = new Row(new Card(55, howBadPoints(55)))
            let row4 = new Row(new Card(88, howBadPoints(88)))
            classicGame.__fakeRowsCreate([row4, row2, row3, row1])
            classicGame.addToPool(new Card(4, howBadPoints(4)), mockPlayer)
            classicGame.addToPool(new Card(3, howBadPoints(3)), mockPlayer2)
            let result = classicGame.fromPoolToRow()
            expect(result.success).toBe(false)
            expect(result.message).toBe(reportMessagesLibrary.game.needToSelect)
            let selectedResult = classicGame.fromPoolToRowWithSelect(0)
            expect(selectedResult.success).toBe(true)
            expect(classicGame.getRows()[0].countOfCards()).toBe(1)
            expect(classicGame.getRows()[0].getRow()[0]?.getNominal()).toBe(3)
            expect(classicGame.getPlayers()[1].getPenaltySet().getCountOfCard()).toBe(1)
            expect(classicGame.getPlayers()[1].getPenaltySet().getPenaltyResult()).toBe(howBadPoints(88))
            let result2 = classicGame.fromPoolToRow()
            expect(result2.success).toBe(true)
            expect(result2.message).toBe(reportMessagesLibrary.ok.okMessage)
            expect(classicGame.getGameState()).toBe(GameStates.process)
            expect(classicGame.getRows()[0].countOfCards()).toBe(2)
        })
    test("", () => {
        
    })
    })
})