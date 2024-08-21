import MongoDBnoSQL, { modelsNameEnum } from "../../Database/initialization"
import {RegUserType} from '../../Entities/RegistratedUser/interface'

const testPath = `mongodb://localhost:27017/cow006dev`
const fakeUser = {
    login: "Test User",
    password: "test password",
    hash: "test Hash",
    id: 'fake id'
}
describe('Проверка работы базы данных MongoDB', () => {
    let MongoDB:MongoDBnoSQL = new MongoDBnoSQL()
    afterAll(async () => {
        await (MongoDB.getModel(modelsNameEnum.RegUser)!).deleteMany()
        MongoDB.disconnect()
    })
    test('MongoDB создает модели и успешно подключается к локальному серверу', async () => {
        MongoDB.initialize()
        expect(MongoDB.getModel(modelsNameEnum.RegUser)).toBeDefined()
        expect(MongoDB.getModel("Hello World")).toBeNull()
        let connection = await MongoDB.connect(testPath)
        expect(connection).toBe(true)
    })
    test('MongoDB может создать объект в базе данных', async() => {
        let Model = MongoDB.getModel(modelsNameEnum.RegUser)
        //@ts-ignore
        let reguser = new Model!<RegUserType>(fakeUser)
        await reguser.save()
        let findedUser:RegUserType = await Model!.findOne({id: "fake id"}) as RegUserType
        expect(findedUser).toBeDefined()
        expect(findedUser.login).toBe(fakeUser.login)
    })
    test("MongoDb может изменять объекты", async () => {
        let Model = MongoDB.getModel(modelsNameEnum.RegUser)
        let reguser = await Model!.findOne({id: 'fake id'})
        //@ts-ignore
        reguser.login = "New Cool Login"
        await reguser!.save()
        let findedUser:RegUserType = await Model!.findOne({id: "fake id"}) as RegUserType
        expect(findedUser).toBeDefined()
        expect(findedUser.login).toBe("New Cool Login")
    })
})