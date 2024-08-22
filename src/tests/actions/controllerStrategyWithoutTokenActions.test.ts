import { loginInDataType, messageFromClientTypes, registrateDataType, registrationUserType, usersType } from "../../../types"
import { v4 as uuid } from 'uuid'
import ws from 'ws'
import { createHmac } from 'node:crypto';
import { registrationAction } from "../../server/actions/registrationAction"
import { logInAction } from "../../server/actions/logInAction";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
import { RegUserType } from "../../Entities/RegistratedUser/interface";
import MongoDBnoSQL from "../../Database/initialization"
import RegUserMongo from "../../Database/RegUserMongo"
import { RegUserSelector } from "../../Entities/RegistratedUser/RegUserSelector";

let mockId = uuid()
let mockRegUsers: registrationUserType = {}
const regUserDTOmock: RegUserType = {
    login: "Alex",
    password: "12345",
    hash: "1225521125",
    id: mockId,
    statistic: {
        matches: 0,
        wins: 0,
        looses: 0
    },
    status: 'player'
}

jest.mock("../../Database/initialization", () =>{
    return jest.fn()
})

jest.mock("../../Database/RegUserMongo", () => {
    return jest.fn().mockImplementation(() => {
        return {
            getByField(field: string, value: string){
                return mockRegUsers[value] || null
            },
            save(data: RegUserType){
                console.log('here')
                mockRegUsers[data.hash] = data
            }
        }
    })
})

describe("Testing action strategy without token in message", () => {
    let db = new MongoDBnoSQL()
    let rgMongo = new RegUserMongo(db)
    let regUserSelector = new RegUserSelector(rgMongo)
    let mockWS = {
        send: (ms: string) => {

        }
    } as ws
    let mockUsers: usersType = {}
    
    let mockData: registrateDataType = {
        type: messageFromClientTypes.registrate,
        data: {
            login: regUserDTOmock.login,
            password: regUserDTOmock.password
        }
    }
    let secreteKey = 'testKey'
    const { login, password } = mockData.data
    const hash = createHmac('sha256', secreteKey)
        .update(`${login}_${password}`)
        .digest('hex');
    regUserDTOmock.hash = hash
    test("registration action registrate users in system", async () => {
        await registrationAction(mockData, mockUsers, secreteKey, regUserSelector, mockWS, mockId)
        expect(mockRegUsers[hash].id).toBe(mockId)
        expect(mockUsers[mockRegUsers[hash].id].getId()).toBe(mockId)
    })
    test("logIn can get access users to system", async () => {
        let logInMockData: loginInDataType = {
            type: messageFromClientTypes.loginIn,
            data: {
                login: regUserDTOmock.login,
                password: regUserDTOmock.password
            }
        }
        let result = await logInAction(logInMockData, secreteKey, regUserSelector, mockWS)
        expect(result.success).toBe(true)
        let logInMockDataWrong: loginInDataType = {
            type: messageFromClientTypes.loginIn,
            data: {
                login: "Inna",
                password: "baby"
            }
        }
        let resultWrong = await logInAction(logInMockDataWrong, secreteKey, regUserSelector, mockWS)
        expect(resultWrong.success).toBe(false)
        expect(resultWrong.message).toBe(reportMessagesLibrary.server.wrongLogInData)
    })
})