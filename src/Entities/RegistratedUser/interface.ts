import { DataBaseReportType } from "../../Adds/Reports/dbReport.type";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { IDBModel } from "../../Database/interface";

export type gameStatistic = {
    matches: number
    wins: number
    looses: number
}

export type AuthRegUserType = {
    login: string,
    password: string
}

export type RegUserType = {
    login: string;
    password: string;
    hash: string;
    id: string;
    statistic: gameStatistic
}

export interface IRegUser {
    getHash():string,
    getId(): string,
    getStatistic(): gameStatistic
    updateStatistic(data: gameStatistic): procedureReportType<IRegUser>
    getAuth():AuthRegUserType
}

export interface IRegUserSelector {
    database: IDBModel<RegUserType>
    getRegUser(field: 'hash', value: string):Promise<DataBaseReportType<IRegUser|null>>
    saveRegUser(user: IRegUser): Promise<DataBaseReportType>
}