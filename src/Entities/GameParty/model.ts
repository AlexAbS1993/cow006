import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { gameRules } from "../../consts/rules";
import { Iplayer } from "../Player/interface";
import { IgameParty } from "./interface";

export class GameParty implements IgameParty {
    private id: string
    private players: Iplayer[] = []
    private countOfPlayers: number = 0
    private gameStarted: boolean
    private leader: Iplayer | null
    constructor(id: string) {
        this.id = id
        this.gameStarted = false
        this.leader = null
    }
    getPlayers(): Iplayer[] {
        return this.players;
    }
    getLeader(): Iplayer | null {
        return this.leader
    }
    setLeaderLikeALeader(player: Iplayer): void {
        this.leader = player
        return
    }
    deletePlayer(id: string): procedureReportType<IgameParty> {
        if (this.players.every(player => player.getId() !== id)) {
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
        if (this.getCountOfPlayers() === gameRules.maximumPlayers) {
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
        if (this.getCountOfPlayers() > 1) {
            return true
        }
        return false
    }
    getCountOfPlayers() {
        return this.countOfPlayers
    }
    getGPid(): string {
        return this.id
    }
    isGameStarted(): boolean {
        return this.gameStarted
    }
    // Метод устанавливает флажок старта игры в true
    setGameStarted() {
        this.gameStarted = true
    }
    // Метод устанавливает флажок старта игры в false, когда игра заканчивается
    setGameEnd() {
        this.gameStarted = false
    }
    isPartyFull() {
        return this.getCountOfPlayers() === gameRules.maximumPlayers
    }
}