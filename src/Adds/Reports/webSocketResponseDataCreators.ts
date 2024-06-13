import { IGame } from "../../Entities/Game/interface";
import { IgameParty } from "../../Entities/GameParty/interface";
import { gameStartedResponseFromServerDataType, handDataForResponsFromServerDataType, playersDataForResponseFromServerDataType, rowsDataForResponseFromServerDataType } from "./webSocketReport.type";

export function gameStartedInfoForResponseCreator(currentGame: IGame, gameParty: IgameParty): gameStartedResponseFromServerDataType{
    let players: playersDataForResponseFromServerDataType[] = []
    let currentGamePlayers = currentGame.getPlayers()
    let rows: rowsDataForResponseFromServerDataType[] = []
    let gamesRows = currentGame.getRows()
    for (let i = 0; i < 4; i++){
        rows[i] = []
        let currentGamesRow = gamesRows[i].getRow()
        for (let j = 0; j < 5; j++){    
            if (currentGamesRow[j] === null){
                rows[i][j] = null
            }    
            else {
                rows[i][j] = {
                    nominal: currentGamesRow[j]!.getNominal(),
                    badPoint: currentGamesRow[j]!.getBadPoints()
                }
            }
        }
    }
    for(let player of currentGamePlayers){
        let hand: handDataForResponsFromServerDataType[] = []
        for (let card of player.getHand().__getHand()){
            hand.push({
                nominal: card.getNominal(),
                badPoint: card.getBadPoints()
            })
        }
        players.push({
            id: player.getId(),
            name: player.getInfo().name,
            hand,
            isLeader: gameParty.getLeader()!.getId() === player.getId()
        })
    }
    return {
        id: currentGame.getGameId(),
        roomId: gameParty.getGPid(),
        gamePartyId: gameParty.getGPid(),
        players,
        rows
    }
}