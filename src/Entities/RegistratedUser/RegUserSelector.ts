import { DataBaseReportType, DBreportTypeEnum } from "../../Adds/Reports/dbReport.type";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { IDBModel } from "../../Database/interface";
import {  IRegUser, IRegUserSelector, RegUserType } from "./interface";
import { RegUser } from "./RegUser";

export class RegUserSelector implements IRegUserSelector {
    database: IDBModel<RegUserType>;
    constructor(db:IDBModel<RegUserType>){
        this.database = db
    }
    async getRegUser(field: "hash", value: string): Promise<DataBaseReportType<IRegUser | null>> {
        let user = await this.database.getByField(field, value)
        if (user === null){
            return {
                success: false,
                message: reportMessagesLibrary.db.notFound,
                type: DBreportTypeEnum["Not Found"]
            }
        }
        let regUser = new RegUser(user)
        return {
            success: true, 
            message: 'ok',
            type: DBreportTypeEnum.Get,
            data: regUser
        }
    }
    async saveRegUser(user: IRegUser): Promise<DataBaseReportType> {
        let regUserDTO: RegUserType = {
            login: user.getAuth().login,
            password: user.getAuth().password,
            id: user.getId(),
            hash: user.getHash(),
            statistic: user.getStatistic()
        }
        try{
            await this.database.save(regUserDTO)
            return {
                success: true, 
                message: 'ok',
                type: DBreportTypeEnum.Created
            }
        } 
        catch(e){
            return {
                success: false,
                message: reportMessagesLibrary.db.notCreated,
                type: DBreportTypeEnum.NotCreated
            }
        }
    }
    
}