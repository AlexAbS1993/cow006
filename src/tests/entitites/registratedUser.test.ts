import { reportMessagesLibrary } from "../../Adds/Reports/reportMessages"
import { ValidatorReportEnum } from "../../Adds/Reports/validatorReport.type"
import { validatorResponseMessage } from "../../Adds/Reports/validatorResportMessage"
import { RegUserType } from "../../Entities/RegistratedUser/interface"
import { RegUser } from "../../Entities/RegistratedUser/RegUser"

describe("Проверка работоспособности модели RegUser и RegUserSelector", () => {
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
    let reguser: RegUser
    beforeEach(() => {
        reguser = new RegUser(regUserDTOmock)
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
        console.log(reguser.getStatistic())
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
})