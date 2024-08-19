import { Model, Document, ObjectId } from "mongoose";
import { RegUserType } from "../Entities/RegistratedUser/interface";
import { modelsNameEnum} from "./initialization";
import MongoDBnoSQL from "./initialization"
import { IDBModel } from "./interface";

 class RegUserMongo implements IDBModel<RegUserType> {
    private model: Model<RegUserType>
    constructor(mongo: MongoDBnoSQL) {
        this.model = mongo.schemas[modelsNameEnum.RegUser]
    }
    async getById(id: string): Promise<RegUserType | null> {
        let candidate: (Document<unknown, {}, RegUserType> & RegUserType & {
            _id: ObjectId;
        }) | null = await this.model.findOne({ id })
        if (!candidate) {
            return null
        }
        return candidate
    }
    async getByField<ValueType>(field: string, value: ValueType): Promise<RegUserType | null> {
        let candidate = await this.model.findOne({ [field]: value })
        if (!candidate) {
            return null
        }
        return {
            login: candidate.login,
            password: candidate.password,
            hash: candidate.hash,
            id: candidate.id,
            statistic: candidate.statistic
        }
    }
    private async getByFieldDocument<ValueType>(field: string, value: ValueType): Promise<(Document<unknown, {}, RegUserType> & RegUserType & {
        _id: ObjectId;
    })> {
        let candidate: (Document<unknown, {}, RegUserType> & RegUserType & {
            _id: ObjectId;
        }) | null = await this.model.findOne({ [field]: value })
        return candidate as (Document<unknown, {}, RegUserType> & RegUserType & {
            _id: ObjectId;
        })
    }
    async save(data: RegUserType): Promise<void> {
        let candidate = await this.getByFieldDocument('id', data.id)
        candidate.schema.paths
        candidate.login = data.login
        candidate.password = data.password
        candidate.hash = data.hash
        candidate.id = data.id
        candidate.statistic = data.statistic
        await candidate.save()
    }
    async update(data: RegUserType): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default RegUserMongo