import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages"
import { ValidatorReportEnum } from "../../Adds/Reports/validatorReport.type"
import MongoDBnoSQL from "../../Database/initialization"
import RegUserMongo from "../../Database/RegUserMongo"
import { RegUserType } from "../../Entities/RegistratedUser/interface"
import { RegUser } from "../../Entities/RegistratedUser/RegUser"
import { RegUserSelector } from "../../Entities/RegistratedUser/RegUserSelector"

const regUserDTOmock: RegUserType = {
    login: "Alex",
    password: "12345",
    hash: "1225521125",
    id: "1",
    statistic: {
        matches: 0,
        wins: 0,
        looses: 0
    }
}

jest.mock("../../Database/initialization")

jest.mock("../../Database/RegUserMongo", () => {
    return jest.fn().mockImplementation(() => {
        return {
            getByField(field: string){
                return {...regUserDTOmock}
            },
            save(data: RegUserType){
                data.id = 'changed'
                return {

                }
            }
        }
    })
})
describe("Проверка работоспособности модели RegUser и RegUserSelector", () => {
    let selectorFactory: RegUserSelector
    let reguser: RegUser
    beforeEach(() => {
        //@ts-ignore
        RegUserMongo.mockClear()
        reguser = new RegUser(regUserDTOmock)
        let mongo = new RegUserMongo(new MongoDBnoSQL())
        selectorFactory = new RegUserSelector(mongo)
    })
    test("RegUser-объект является инстансом класса RegUser", () => {
        expect(reguser instanceof RegUser)
    })
    test("RegUser-объект возвращает данные по аутентификации", () => {
        expect(reguser.getAuth()).toMatchObject({login: 'Alex', password: '12345'})
    })
    test("RegUser возвращает данные по статистике", () => {
        expect(reguser.getStatistic()).toMatchObject({
            matches: 0,
            wins: 0,
            looses: 0
        })
    })
    test("RegUser возвращает данные по хэшу и id", () => {
        let hash = reguser.getHash()
        let id = reguser.getId()
        expect(typeof hash).toBe("string")
        expect(typeof id).toBe("string")
        expect(hash).toBe(regUserDTOmock.hash)
        expect(id).toBe(regUserDTOmock.id)
    })
    test("RegUser позволяет менять свою статистику, возвращает отчёт о процедуре, в котором уведомляет об успехе или провале операции", () => {
        let currentStatistic = reguser.getStatistic()
        let reportOfChange = reguser.updateStatistic({...currentStatistic, wins: 1, matches: 1})
        expect(reguser.getStatistic()).toMatchObject({wins: 1, looses: 0, matches: 1})
        expect(reportOfChange.success).toBe(true)
        expect(reportOfChange.message).toBe(ValidatorReportEnum.ok)
        //@ts-ignore
        let reportOfChangeWithFail = reguser.updateStatistic({trophy: 0})
        expect(reportOfChangeWithFail.success).toBe(false)
        expect(reportOfChangeWithFail.message).toBe(reportMessagesLibrary.userReg.wrongStatisticData)
        //@ts-ignore
        let reportOfChangeWithNumFail = reguser.updateStatistic({wins: 'hello', looses: 'plaki', matches: 3})
        expect(reportOfChangeWithNumFail.success).toBe(false)
        expect(reportOfChangeWithNumFail.message).toBe(reportMessagesLibrary.userReg.wrongTypes)
    })
    test('Фабрика (селектор) по созданию regUsers создает regUsers', async () => {
        let user = await selectorFactory.getRegUser("1225521125")
        expect(user.data).toBeDefined()
        expect(user.data instanceof RegUser).toBe(true)
        expect(user.data?.getHash()).toBe("1225521125")
        expect(RegUserMongo).toHaveBeenCalledTimes(1)
    })
})