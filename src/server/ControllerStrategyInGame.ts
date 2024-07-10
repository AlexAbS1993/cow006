import { expectedParsedDataType, messageForSendFromServerEnum, messageFromClientTypes } from "../../types";
import { reportMessagesLibrary } from "../Adds/Reports/reportMessages";
import { cardFromPoolToRowPlacedSuccessfully, playersHandsType, playersIdFromServerDataType, playersMakeTurnDataTypeResonseFromServer, switchToCheckMessageFromServerPoolDataType, webSocketProcedureReportType } from "../Adds/Reports/webSocketReport.type";
import {playersHandsForResponseDataCreator } from "../Adds/Reports/webSocketResponseDataCreators/playersHandsForResoinseData";
import { poolCheckingForResponsDataCreator } from "../Adds/Reports/webSocketResponseDataCreators/poolCheckedForResponse";
import { webSocketReportMessagesLibrary } from "../Adds/Reports/webSocketResponseMessage";
import { Icard } from "../Entities/Card/interface";
import { IGame } from "../Entities/Game/interface";
import { IgameParty } from "../Entities/GameParty/interface";
import { Iplayer } from "../Entities/Player/interface";
import { poolCellType } from "../Entities/Pool/interface";
import { GameStates } from "../consts/rules";
import { playerMakesTurn } from "./actions/playerMakesTurnAction";
import { IUser } from "./entities/user/interface";
import { IWebSocketMessageController } from "./interface";

export class ControllerStrategyInGame implements IWebSocketMessageController{
    messageData: expectedParsedDataType
    private room: IUser[]
    private gp: IgameParty
    private currentUser: IUser
    private currentPlayer: Iplayer
    private currentGame: IGame
    constructor(data: expectedParsedDataType, room: IUser[], gp: IgameParty, currentUser: IUser, currentPlayer: Iplayer, currentGame: IGame){
        this.messageData = data
        this.room = room
        this.gp = gp
        this.currentPlayer = currentPlayer
        this.currentUser = currentUser
        this.currentGame = currentGame
    }
    execute(): void {
        switch (this.messageData.type){
            case messageFromClientTypes.playerMakesTurn: {
                let parsedData = this.messageData.data
                parsedData.nOcard = Number(parsedData.nOcard)
                let player = this.currentGame.getPlayers().find(findingPlayer => findingPlayer.getId() === parsedData.player)
                let card = player!.getHand().getCard(parsedData.nOcard)
                if (card === null){
                    let report: webSocketProcedureReportType<null> = {
                        success: false,
                        message: webSocketReportMessagesLibrary.cardDosntExist(),
                        type: messageForSendFromServerEnum.cardNotExist
                    }
                    this.room.forEach(user => {
                        user.getWS()!.send(JSON.stringify(report))
                    })   
                    break
                }
                let resultOfPooling = playerMakesTurn(player as Iplayer, card as Icard, this.currentGame)
                if (resultOfPooling.success){
                    let isAllSettled = this.currentGame.getPool().isAllSettled() 
                    if (isAllSettled){
                        // Необходимо раскрыть все карты и отправить отсортированную версию пула
                        let poolData: switchToCheckMessageFromServerPoolDataType = this.currentGame.getPool().getPool().map(card => {
                            return {
                                nominal: card.card.getNominal(),
                                badPoint: card.card.getBadPoints(),
                                playerId: card.player.getId()
                            }
                        })
                       let report: webSocketProcedureReportType<switchToCheckMessageFromServerPoolDataType> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.afterTurnSwitchToChek(player!.getInfo().name),
                        type: messageForSendFromServerEnum.afterTurnSwitchToCheck,
                        data: poolData
                       }
                       this.room.forEach(user => {
                        user.getWS()!.send(JSON.stringify(report))
                    })                         
                    }
                    else {
                        let report: webSocketProcedureReportType<playersMakeTurnDataTypeResonseFromServer> = {
                            success: true, 
                            message: webSocketReportMessagesLibrary.playerMakeTurn(player!.getInfo().name),
                            type: messageForSendFromServerEnum.playerMakesTurn,
                            data: {
                                playerTurn: player!.getId()
                            }
                        }
                        this.room.forEach(user => {
                            user.getWS()!.send(JSON.stringify(report))
                        })
                    }    
                }
                break
            }
            case messageFromClientTypes.checkCardFromPool: {
                if (this.currentGame.getGameState() === GameStates.checking){
                    let currentPoollingCell = this.currentGame.getPoolingCell() as poolCellType 
                    let resultOfMovementFromPoolToRow = this.currentGame.fromPoolToRow()
                    if (resultOfMovementFromPoolToRow.message === reportMessagesLibrary.game.anotherStep){
                        this.room.forEach(user => {
                            user.getWS()!.send("anotherStep")
                        })
                        break
                    }
                    // Необходимо вновь отправить запрос с указанием полосы для замены
                    if (resultOfMovementFromPoolToRow.message === reportMessagesLibrary.game.needToSelect){
                        let report: webSocketProcedureReportType<playersIdFromServerDataType> = {
                            success: false,
                            message: webSocketReportMessagesLibrary.needToSelectRow(),
                            type: messageForSendFromServerEnum.needToSelectRow,
                            data: {
                                playersId: currentPoollingCell.player.getId()
                            }
                           }
                           this.room.forEach(user => {
                            user.getWS()!.send(JSON.stringify(report))
                        })
                        break
                    }
                    // Переключение после проверки на игровой процесс
                    if (resultOfMovementFromPoolToRow.message === reportMessagesLibrary.game.switchToProcess){
                        let dataForSend:cardFromPoolToRowPlacedSuccessfully = poolCheckingForResponsDataCreator(this.currentGame, currentPoollingCell.player, currentPoollingCell.card)
                        let report: webSocketProcedureReportType<cardFromPoolToRowPlacedSuccessfully> = {
                            success: true,
                            message: webSocketReportMessagesLibrary.switchToProcess(),
                            type: messageForSendFromServerEnum.switchToProcess,
                            data: dataForSend
                           }
                           this.room.forEach(user => {
                            user.getWS()!.send(JSON.stringify(report))
                        })
                           break
                    }
                    // Успешное размещение карты из пула в row
                    else {
                        let dataForSend:cardFromPoolToRowPlacedSuccessfully = poolCheckingForResponsDataCreator(this.currentGame, currentPoollingCell.player, currentPoollingCell.card)
                        let report: webSocketProcedureReportType<cardFromPoolToRowPlacedSuccessfully> = {
                            success: true,
                            message: webSocketReportMessagesLibrary.fromPoolToRowSuccess(),
                            type: messageForSendFromServerEnum.fromPoolToRowSucces,
                            data: dataForSend
                           }
                        this.room.forEach(user => {
                            user.getWS()!.send(JSON.stringify(report))
                        })
                    }
                    break
                }
                else {
                    // Невозможность размещения. Не тот ход
                    let report = {
                        success: false,
                        message: webSocketReportMessagesLibrary.anotherStep(),
                        type: messageForSendFromServerEnum.anotherStep
                    }
                    this.room.forEach(user => {
                        user.getWS()!.send(JSON.stringify(report))
                    })
                    break
                }    
            }
            case messageFromClientTypes.checkCardFromPoolWithReplace: {
                let currentPoollingCell = this.currentGame.getPoolingCell() as poolCellType
                let parsedData = this.messageData.data
                let resultOfMovementFromPoolToRow = this.currentGame.fromPoolToRowWithSelect(parsedData.rowIndex)
                if (resultOfMovementFromPoolToRow.message === reportMessagesLibrary.game.switchToProcess){
                    let dataForSend:cardFromPoolToRowPlacedSuccessfully = poolCheckingForResponsDataCreator(this.currentGame, currentPoollingCell.player, currentPoollingCell.card)
                    let report: webSocketProcedureReportType<cardFromPoolToRowPlacedSuccessfully> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.switchToProcess(),
                        type: messageForSendFromServerEnum.switchToProcess,
                        data: dataForSend
                       }
                       this.room.forEach(user => {
                        user.getWS()!.send(JSON.stringify(report))
                    })
                       break
                }
                let dataForSend:cardFromPoolToRowPlacedSuccessfully = poolCheckingForResponsDataCreator(this.currentGame, currentPoollingCell.player, currentPoollingCell.card)
                let report: webSocketProcedureReportType<cardFromPoolToRowPlacedSuccessfully> = {
                    success: true,
                    message: webSocketReportMessagesLibrary.fromPoolToRowSuccess(),
                    type: messageForSendFromServerEnum.fromPoolToRowSucces,
                    data: dataForSend
                   }
                this.room.forEach(user => {
                    user.getWS()!.send(JSON.stringify(report))
                })
                break
            }
            case messageFromClientTypes.needToTakeHands: {
                let players = this.currentGame.getPlayers()
                let users = this.room
                let playersHands: playersHandsType = playersHandsForResponseDataCreator(players)
                if (playersHands[players[0].getId()].length === 0){
                    let report = {
                        success: false,
                        message: webSocketReportMessagesLibrary.endGameNotify(),
                        type: messageForSendFromServerEnum.endGameReady
                    }
                    users.forEach(user => {
                        user.getWS()!.send(JSON.stringify(report))
                    })
                    break
                }
                let report: webSocketProcedureReportType<playersHandsType> = {
                    success: true,
                    message: webSocketReportMessagesLibrary.successGettingHand(),
                    type: messageForSendFromServerEnum.gettingHandSuccess,
                    data: playersHands
                }
                users.forEach(user => {
                    user.getWS()!.send(JSON.stringify(report))
                })
                break
            }
            case messageFromClientTypes.getEndGameResults: {
                let report =  {
                    success: true,
                    data: this.currentGame.getEndsResult(),
                    type: messageForSendFromServerEnum.endGameReady
                }
                this.room.forEach(user => {
                    user.getWS()!.send(JSON.stringify(report))
                })
                break
            }
            default: {
                break
            }
        }
    }
    
}