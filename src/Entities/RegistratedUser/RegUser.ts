import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
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
    updateStatistic(data: gameStatistic): procedureReportType<this> {
        let validationFieldResult =this.statisticFieldValidate(data) 
        if (!validationFieldResult.success){
            return validationFieldResult
        }
        let validationTypeResult = this.statisticTypeValidate(data)
        if (!validationTypeResult.success){
            return validationTypeResult
        }
        this.statistic = data
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
    private statisticFieldValidate(data: gameStatistic): procedureReportType<this>{
        let requiredFields: (keyof typeof this.statistic)[] = Object.keys(this.statistic) as (keyof typeof this.statistic)[]
        for (let field of requiredFields){
            if (!data[field]){
                return {
                    success: false,
                    message: reportMessagesLibrary.userReg.wrongStatisticData,
                    instance: this
                }
            }
        }
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
    private statisticTypeValidate(data: gameStatistic): procedureReportType<this>{
        for (let key in data){
            if (typeof data[key as keyof gameStatistic]  !== 'number'){
                return {
                    success: false, 
                    message: reportMessagesLibrary.userReg.wrongTypes,
                    instance: this
                }
            }
        }
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
    private login: string;
    private password: string;
    private hash: string;
    private id: string;
    private statistic: gameStatistic;
}