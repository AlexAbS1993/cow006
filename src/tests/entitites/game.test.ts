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

describe("Сущность Game хранит в себе все данные о текущей партии. В неё будет включен список игроков \
колода и игровые полосы, заполняемые по особым правилам", () => {
    let mockId = uuid()
    let mockId2 = uuid()
    let classicMode = "classic"
    let tactikMode = "tactic"
    let mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockParty = new GameParty(uuid())
    mockParty.addPlayer(mockPlayer)
    mockParty.addPlayer(mockPlayer2)
    mockParty.setLeaderLikeALeader(mockPlayer)
    let classicGame = new Game(mockId, classicMode, mockParty)
    let tacticGame = new Game(mockId2, tactikMode, mockParty)
    test("Игра имеет статус готовности и неготовности", () => {
        expect(classicGame.isReady()).toBe(false)
        expect(tacticGame.isReady()).toBe(false)
    })
    test("Игра содержит список игроков", () => {
        expect(classicGame.getPlayers().length).toBe(2)
    })
    test("Игра хранит данные по моду", () => {
        expect(classicGame.getMode()).toBe(classicMode)
        expect(tacticGame.getMode()).toBe(tactikMode)
    })
    test("Игра хранит в себе данные по party", () => {
        expect(classicGame.getParty()).toBeDefined()
        expect(classicGame.getParty().getLeader().id).toBe(mockPlayer.getId())
    })
    test("У игры есть колода", () => {
        expect(classicGame.getStuff() instanceof Stuff).toBe(true)
        expect(classicGame.getStuff().getCountOfCard()).toBe(103)
        expect(tacticGame.getStuff().getCountOfCard()).toBe(24)
    })
    test("У игры есть 3 состояния: ПОДГОТОВКА, процесс и конец игры", () => {
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
    test("У игры есть 3 состояния: подготовка, ПРОЦЕСС и конец игры", () => {
        expect(classicGame.getGameState()).toBe("process")
    })
    test("У игры есть 2 шага - ход и распределение", () => {
        expect(classicGame.getGameStep()).toBe("cardSelection")
    })
    test("У игры есть пул выбора карт от игроков, участвующих в игре", () => {
        let randomCard: Icard = new Card(1, 1)
        classicGame.addToPool(randomCard, mockPlayer)
        expect(classicGame.getPool().length).toBe(1)
    })
    test("Игра распределяет пул карт от игроков по возрастанию и очищает его после распределения карт по rows", () => {
        let randomCard1: Icard = new Card(1, 1)
        let randomCard2: Icard = new Card(2, 1)
        classicGame.addToPool(randomCard2, mockPlayer)
        classicGame.addToPool(randomCard1, mockPlayer2)
        expect(classicGame.getPool()[0].card().getNominal()).toBe(1)
        expect(classicGame.getPool()[0].player().getInfo().name).toBe(mockPlayer.getInfo().name)
        expect(classicGame.getPool()[1].card().getNominal()).toBe(2)
    })
    test("Игра включает в себя 4 row с начальными картами на старте", () => {
        const rows: IRow[] = classicGame.getRows()
        expect(rows.length).toBe(4)
        expect(rows[0].countOfCards()).toBe(1)
    })
    test("Игра не допускает добавления карты в пул дважды одним игроком", () => {
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
        let row1 = new Row(new Card(5, 1))
        let row2 = new Row(new Card(25, howBadPoints(25)))
        let row3 = new Row(new Card(55, howBadPoints(55)))
        let row4 = new Row(new Card(88, howBadPoints(88)))
        classicGame.__fakeRowsCreate([row4, row2, row3, row1])
        classicGame.addToPool(new Card(9, howBadPoints(9)))
        classicGame.addToPool(new Card(99, howBadPoints(99)))
        if (classicGame.getPool().isAllSettled()) {
            classicGame.fromPoolToRow()
        }
        let pool: IPool = classicGame.getPool()
        expect(pool.isAllSettled()).toBe(false)
        expect(pool.getCountOfPlaces()).toBe(2)
        let rows: IRow[] = classicGame.getRows()
        expect(rows[3].countOfCards()).toBe(2)
        expect(rows[2].countOfCards()).toBe(1)
        expect(rows[0].countOfCards()).toBe(2)
    })
    test("Игра проверяет, остались ли у игроков карты на руках и, или раздаёт новые карты \
        ,или подготавливается к концу игры", () => {

    })
    test("Game после объявления конца игры подсчитывает результаты и выдает сводную таблицу", () => {
        classicGame.__fakeEndGame()
        mockPlayer.getPenaltySet().addCard(new Card(11, howBadPoints(11)))
        let result: resultEndGameType = classicGame.getEndsResult()
        for (let playerStat in result) {
            if (result[playerStat].id === mockPlayer.getId()) {
                expect(result[playerStat].badPoints).toBe(howBadPoints(11))
            }
            else {
                expect(result[playerStat].winner).toBe(true)
            }
        }
    })
})