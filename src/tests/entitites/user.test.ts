import { IUser } from "../../server/entities/user/interface"
import { v4 as uuid } from 'uuid'
import ws from 'ws'
import { User } from "../../server/entities/user/model"

describe("User – сущность, связанная с веб-сокетом пользователя и отражающая его нахождение на сервере. \
        Внутри сущности находятся данные по id, имени, текущей комнате, если такая есть, и о сокете",
    () => {
        let user: IUser
        let id = uuid()
        beforeEach(() => {
            user = new User(id, "Valentin")
        })
        test("Создаётся объект юзера, у которого инстансом является класс User", () => {
            expect(user instanceof User).toBe(true)
        })
        test("Объект юзера возвращает собственное айди, являющееся строкой", () => {
            expect(user.getId()).toBe(id)
            expect(typeof user.getId()).toBe("string")
        })
        test("Объект user может менять своё имя", () => {
            expect(user.getName()).toBe("Valentin")
            user.setName("Alex")
            expect(user.getName()).toBe("Alex")
        })
        test("Объект user не должен быть в игре после создания. После вступления в игру это отражается на его статусе inGame", () => {
            expect(user.inGame()).toBe(false)
            user.setInGame(true)
            expect(user.inGame()).toBe(true)
        })
        test("Объект user записывает id комнаты через специальный метод", () => {
            let roomId = uuid()
            user.setRoom(roomId)
            expect(user.getRoomId()).toBe(roomId)
        })
        test("Объект user хранит текущий веб сокет", () => {
            let mockWs = {} as ws
            user.setCurrentWebSocket(mockWs)
            expect(user.getWS()).toBe(mockWs)
        })
    })