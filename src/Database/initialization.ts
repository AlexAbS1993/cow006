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
            return true
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
                type: {
                    wins: Number,
                    looses: Number,
                    matches: Number
                },
                default: {
                    wins: 0,
                    looses: 0,
                    matches: 0
                }
            }
        })
        if (!this.mongoose.models[modelsNameEnum.RegUser]){
            let regUserModel = this.mongoose.model(modelsNameEnum.RegUser, regUserSchema)
            this.schemas[modelsNameEnum.RegUser] = regUserModel
        }
        else {
            this.schemas[modelsNameEnum.RegUser] = this.mongoose.models[modelsNameEnum.RegUser]
        }        
        return
    }
    async disconnect(){
        await this.mongoose.disconnect()
        return true
    }
}

export default MongoDBnoSQL