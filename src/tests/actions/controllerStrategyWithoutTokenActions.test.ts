import { loginInDataType, messageFromClientTypes, registrateDataType, registrationUserType, usersType } from "../../../types"
import { v4 as uuid } from 'uuid'
import ws from 'ws'
import { createHmac } from 'node:crypto';
import { registrationAction } from "../../server/actions/registrationAction"
import { logInAction } from "../../server/actions/logInAction";
import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages";
describe("Testing action strategy without token in message", () => {
    let mockId = uuid()
    let mockWS = {
        send: (ms: string) => {

        }
    } as ws
    let mockUsers: usersType = {}
    let mockRegUsers: registrationUserType = {}
    let mockData: registrateDataType = {
        type: messageFromClientTypes.registrate,
        data: {
            login: "Alex",
            password: "abyss"
        }
    }
    let secreteKey = 'testKey'
    const { login, password } = mockData.data
    const hash = createHmac('sha256', secreteKey)
        .update(`${login}_${password}`)
        .digest('hex');
    test("registration action registrate users in system", () => {
        registrationAction(mockData, mockUsers, secreteKey, mockRegUsers, mockWS, mockId)
        expect(mockRegUsers[hash].id).toBe(mockId)
        expect(mockUsers[mockRegUsers[hash].id].getId()).toBe(mockId)
    })
    test("logIn can get access users to system", () => {
        let logInMockData: loginInDataType = {
            type: messageFromClientTypes.loginIn,
            data: {
                login: "Alex",
                password: "abyss"
            }
        }
        let result = logInAction(logInMockData, secreteKey, mockRegUsers, mockWS)
        expect(result.success).toBe(true)
        let logInMockDataWrong: loginInDataType = {
            type: messageFromClientTypes.loginIn,
            data: {
                login: "Inna",
                password: "baby"
            }
        }
        let resultWrong = logInAction(logInMockDataWrong, secreteKey, mockRegUsers, mockWS)
        expect(resultWrong.success).toBe(false)
        expect(resultWrong.message).toBe(reportMessagesLibrary.server.wrongLogInData)
    })
})