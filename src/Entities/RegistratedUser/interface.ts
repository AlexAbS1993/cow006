import { DataBaseReportType } from "../../Adds/Reports/dbReport.type";
import { procedureReportType } from "../../Adds/Reports/procedureReport.type";
import { IDBModel } from "../../Database/interface";

export type gameStatistic = {
    matches: number
    wins: number
    looses: number
}

export interface IRegUser {
    login: string;
    password: string;
    hash: string;
    id: string;
    statistic: gameStatistic
}

export interface IRegUserSelector {
    database: IDBModel<IRegUser>
    getRegUser(field: 'hash', value: string):Promise<DataBaseReportType<IRegUser|null>>
    saveRegUser(user: IRegUser): Promise<DataBaseReportType>
}