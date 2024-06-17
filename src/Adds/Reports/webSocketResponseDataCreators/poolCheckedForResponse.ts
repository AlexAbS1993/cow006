import { Icard } from "../../../Entities/Card/interface";
import { IGame } from "../../../Entities/Game/interface";
import { Iplayer } from "../../../Entities/Player/interface";
import { cardFromPoolToRowPlacedSuccessfully, rowsDataForResponseFromServerDataType } from "../webSocketReport.type";

export function poolCheckingForResponsDataCreator(currentGame: IGame, player: Iplayer, card: Icard): cardFromPoolToRowPlacedSuccessfully{
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
    return {
        rows, playersId: player.getId(), cardN: card.getNominal()
    }
}