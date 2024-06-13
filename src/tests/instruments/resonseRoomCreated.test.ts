import { roomCreatedForResponse } from "../../Adds/Reports/webSocketResponseDataCreators/roomCreatedForResponse"
import { User } from "../../server/entities/user/model"
import {v4} from 'uuid'

describe("Функция создаёт объект с идентификатором (id) комнаты, который отсылается в последствии пользователю по web-socket", () => {
    let user = new User(v4(), "Alex")
    let roomId = v4()
    user.setRoom(roomId)
    let reportData = roomCreatedForResponse(user)
    test("Функция возвращает объект с полем. В поле строка roomId имевшаяся у пользователя.",() => {
            expect(reportData.roomId).toBeDefined()
            expect(reportData.roomId).toBe(roomId)
            expect(typeof reportData.roomId).toBe("string")
    })
})