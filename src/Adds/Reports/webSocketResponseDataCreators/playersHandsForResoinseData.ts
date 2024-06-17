import { Iplayer } from "../../../Entities/Player/interface";
import { playersHandsType } from "../webSocketReport.type";

export function playersHandsForResponseDataCreator(players: Iplayer[]): playersHandsType{
    let result = {} as playersHandsType
    for (let player of players){
        let hand = player.getHand().__getHand()
        result[player.getId()] = hand.map(card => {
            return {
                nominal: card.getNominal(),
                badPoint: card.getBadPoints()
            }
        })
    }
    return result
}