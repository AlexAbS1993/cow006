import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../consts/reportMessages";
import { gameRules } from "../../consts/rules";
import { Iplayer } from "../Player/interface";
import { IgameParty, listOfPlayers, playersFields } from "./interface";

export class GameParty implements IgameParty{
    private id: number
    private players: Iplayer[] = []
    private countOfPlayers: number = 0
    constructor(){
        this.id = Math.floor(Math.random() * 100000000)
    }
    deletePlayer(id: string): procedureReportType<IgameParty> {
        if (this.players.every(player => player.getId() !== id)){
            return {
                success: false,
                message: reportMessagesLibrary.GameParty.noThatPlayer,
                instance: this
            }
        }
        this.players = this.players.filter(player => player.getId() !== id)
        this.decrieseCountOfPlayer()
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
    increaseCountOfPlayer(): void {
        this.countOfPlayers++
    }
    decrieseCountOfPlayer(): void {
        this.countOfPlayers--
    }
    addPlayer(player: Iplayer): procedureReportType<IgameParty> {
       if(this.getCountOfPlayers() === gameRules.maximumPlayers){
        return {
            success: false,
            message: reportMessagesLibrary.GameParty.more4Player,
            instance: this
        }
       }   
       this.players.push(player)
       this.increaseCountOfPlayer()  
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
    isReadyToStart(): boolean {
        if(this.getCountOfPlayers() > 1){
            return true
        }
        return false
    }
    getCountOfPlayers(){
        return this.countOfPlayers
    }
    getGPid(): number {
        return this.id
    }
}