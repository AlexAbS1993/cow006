import mongoose, { Model } from "mongoose"
import { RegUserType } from "../Entities/RegistratedUser/interface"

export enum modelsNameEnum {
    "RegUser" = "RegUser"
}

class MongoDBnoSQL {
    mongoose: typeof mongoose
    schemas: {[key: string]: Model<any>}
    constructor(){
        this.mongoose = mongoose
        this.schemas = {}
    }
    async connect(path: string){
        try{
            await this.mongoose.connect(path)
        }
        catch(e: any){
            throw new Error(e.message)
        }
    }
    getModel<T>(model: string):Model<T>|null{
        return this.schemas[model] ? this.schemas[model] : null
    }
    initialize(){
        let regUserSchema = new this.mongoose.Schema<RegUserType>({
            login: {
                type: String, required: true
            },
            password: {
                type: String, required: true
            },
            hash: {
                type: String, required: true
            },
            id: {
                type: String, required: true
            },
            statistic: {
                wins: Number,
                looses: Number,
                matches: Number
            }
        })
        let regUserModel = this.mongoose.model(modelsNameEnum.RegUser, regUserSchema)
        this.schemas[modelsNameEnum.RegUser] = regUserModel
        return
    }
}

export default MongoDBnoSQL