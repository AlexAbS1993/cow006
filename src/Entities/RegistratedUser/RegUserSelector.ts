import { DataBaseReportType, DBreportTypeEnum } from "../../Adds/Reports/dbReport.type";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { ValidatorReportEnum, ValidatorReportType } from "../../Adds/Reports/validatorReport.type";
import { IDBModel } from "../../Database/interface";
import { IRegUser, IRegUserSelector, RegUserType } from "./interface";
import { RegUser } from "./RegUser";

export class RegUserSelector implements IRegUserSelector {
    database: IDBModel<RegUserType>;
    constructor(db: IDBModel<RegUserType>) {
        this.database = db
    }
    async getRegUser(value: string, field: keyof RegUserType = "hash"): Promise<DataBaseReportType<IRegUser | null>> {
        let user = await this.database.getByField(field, value)
        if (user === null) {
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
        let dtoValidator = this.regUserSaveDTOValidator(regUserDTO)
        if (!dtoValidator.success) {
            return {
                success: dtoValidator.success,
                message: dtoValidator.message,
                type: DBreportTypeEnum.NotCreated,
                dbErrorMessage: dtoValidator.type
            }
        }
        try {
            await this.database.save(regUserDTO)
            return {
                success: true,
                message: 'ok',
                type: DBreportTypeEnum.Created
            }
        }
        catch (e: any) {
            return {
                success: false,
                message: reportMessagesLibrary.db.notCreated,
                type: DBreportTypeEnum.NotCreated,
                dbErrorMessage: e.message
            }
        }
    }
    create(userDTO: RegUserType): IRegUser {
        // Необходима валидация входящих данных!
        return new RegUser(userDTO)
    }
    private regUserSaveDTOValidator(DTO: RegUserType): ValidatorReportType {
        let requiredFields: (keyof RegUserType)[] = ['login', 'password', 'id', 'hash', 'statistic']
        for (let value of requiredFields) {
            if (!DTO[value]) {
                return {
                    success: false,
                    message: reportMessagesLibrary.userReg.wrongRegUserData,
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
}