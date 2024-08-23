import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { ValidatorReportEnum, ValidatorReportType } from "../../Adds/Reports/validatorReport.type";
import { validatorResponseMessage } from "../../Adds/Reports/validatorResportMessage";
import { AuthRegUserType, gameStatistic, IRegUser, RegUserType } from "./interface";

export class RegUser implements IRegUser{
    constructor(regUserDTO: RegUserType){
        let {login, password, hash, id, statistic: {wins, looses, matches}, status} = regUserDTO
        this.login = login
        this.password = password
        this.hash = hash
        this.statistic = {wins, looses, matches}
        this.id = id
        this.status = status
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
            return {
                instance: this,
                success: false, 
                message: reportMessagesLibrary.userReg.wrongStatisticData
            }
        }
        let validationTypeResult = this.statisticTypeValidate(data)
        if (!validationTypeResult.success){
            return {
                instance: this,
                success: false, 
                message: reportMessagesLibrary.userReg.wrongTypes
            }
        }
        this.statistic = data
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            instance: this
        }
    }
    getStatus(): "admin" | "player" {
        return this.status
    }
    private statisticFieldValidate(data: gameStatistic): ValidatorReportType{
        let requiredFields: (keyof typeof this.statistic)[] = Object.keys(this.statistic) as (keyof typeof this.statistic)[]
        for (let field of requiredFields){
            if (data[field] === undefined){
                return {
                    success: false,
                    message: validatorResponseMessage.wrongDataSet,
                    type: ValidatorReportEnum.NoRequiredField
                }
            }
        }
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            type: ValidatorReportEnum.ok
        }
    }
    private statisticTypeValidate(data: gameStatistic): ValidatorReportType{
        for (let key in data){
            if (typeof data[key as keyof gameStatistic]  !== 'number'){
                return {
                    success: false, 
                    message: validatorResponseMessage.wrongType,
                    type: ValidatorReportEnum.WrongType
                }
            }
        }
        return {
            success: true,
            message: reportMessagesLibrary.ok.okMessage,
            type: ValidatorReportEnum.ok
        }
    }
    private login: string;
    private password: string;
    private hash: string;
    private id: string;
    private statistic: gameStatistic;
    private status: "admin"|"player"
}