import { AuthRegUserType, gameStatistic, IRegUser, RegUserType } from "./interface";

export class RegUser implements IRegUser{
    constructor(regUserDTO: RegUserType){
        let {login, password, hash, id, statistic: {wins, looses, matches}} = regUserDTO
        this.login = login
        this.password = password
        this.hash = hash
        this.statistic = {wins, looses, matches}
        this.id = id
    }
    getAuth(): AuthRegUserType {
        return {
            login: this.login,
            password: this.password
        }
    }
    getHash(): string {
        return this.hash
    }
    getId(): string {
        return this.id
    }
    getStatistic(): gameStatistic {
        return this.statistic
    }
    updateStatistic(data: gameStatistic): void {
        // @ERROR_MAYBE
        this.statistic = data
        return
    }
    private login: string;
    private password: string;
    private hash: string;
    private id: string;
    private statistic: gameStatistic;
}