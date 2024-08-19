import { Model } from "mongoose";
import { RegUserType } from "../Entities/RegistratedUser/interface";
import { modelsNameEnum, MongoDBnoSQL } from "./initialization";
import { IDBModel } from "./interface";

export class RegUserMongo implements IDBModel<RegUserType> {
    private model: Model<RegUserType>
    constructor(mongo: MongoDBnoSQL){
        this.model = mongo.schemas[modelsNameEnum.RegUser]
    }
    async getById(id: string): Promise<RegUserType | null> {
        let candidate = await this.model.findOne({id})
        if (!candidate){
            return null
        }
        return candidate
    }
    async getByField<ValueType>(field: string, value: ValueType): Promise<RegUserType|null> {
        let candidate = await this.model.findOne({[field]: value})
        if (!candidate){
            return null
        }
        return candidate
    }
    async save(data: RegUserType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async update(data: RegUserType): Promise<void> {
        throw new Error("Method not implemented.");
    }
}