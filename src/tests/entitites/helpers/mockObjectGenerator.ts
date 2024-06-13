import { Game } from "../../../Entities/Game/model"
import { GameParty } from "../../../Entities/GameParty/model"
import { Player } from "../../../Entities/Player/model"
import { GameMods } from "../../../consts/rules"
import { playersIdGenerator } from "./playersIdGenerator"
import { playersInfoGenerator } from "./playersInfoGenerator"
import {v4 as uuid} from 'uuid'

export function mockGenerator(){
    let mockPlayer = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockPlayer2 = new Player(playersInfoGenerator(), playersIdGenerator()) 
    let mockPlayer3 = new Player(playersInfoGenerator(), playersIdGenerator())
    let mockId = uuid()
    let mockIdGenerator = uuid
    let mockParty = new GameParty(mockId)
    mockParty.addPlayer(mockPlayer)
    mockParty.addPlayer(mockPlayer2)
    mockParty.addPlayer(mockPlayer3)
    mockParty.setLeaderLikeALeader(mockPlayer)
    let classicGame = new Game(mockId, GameMods.classic, mockParty)
    let tacticGame = new Game(mockId+`1`, GameMods.tactic, mockParty)
    return {
        classicGame, mockPlayer, mockPlayer2, mockPlayer3, mockId, mockIdGenerator, mockParty, tacticGame
    }
}