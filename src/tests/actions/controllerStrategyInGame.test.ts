import { Card } from "../../Entities/Card/model"
import { Game } from "../../Entities/Game/model"
import { GameParty } from "../../Entities/GameParty/model"
import { Player } from "../../Entities/Player/model"
import { GameMods } from "../../consts/rules"
import { playerMakesTurn } from "../../server/actions/playerMakesTurnAction"
import { playersIdGenerator } from "../entitites/helpers/playersIdGenerator"
import { playersInfoGenerator } from "../entitites/helpers/playersInfoGenerator"

describe("InGame Strategy используется, когда пользователь участвует в игре", () => {
    let mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockParty = new GameParty('2222')
    mockParty.addPlayer(mockPlayer)
    mockParty.addPlayer(mockPlayer2)
    let mockGame = new Game('1111', GameMods.tactic, mockParty)
    mockGame.prepare()
    test("playerMakeTurnAction обеспечивает ход игрока. Экшен срабатывает после прихода месседжа с соответствующим типом", () =>{
        let result = playerMakesTurn(mockPlayer, mockPlayer.getHand().__getHand()[0], mockGame)
        expect(result.success).toBe(true)
        expect(mockGame.getPool().getCountOfPlaces().allover).toBe(2)
        expect(mockGame.getPool().getCountOfPlaces().free).toBe(1)
    })
})