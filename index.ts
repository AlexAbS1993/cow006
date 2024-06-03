import express from "express"
import cors from 'cors'
import ws from 'ws'
import { v4 as uuid } from 'uuid'
import { clientsType, expectedParsedDataType, gamesType, registrationUserType, roomsType, usersType } from "./types"
import { WebSocketMessageController } from "./src/server/ControllerStrategy"
import { ControllerStrategyWithoutToken } from "./src/server/ControllerStrategyWithoutToken"
import { ControllerWrongTokenStrategy } from "./src/server/ControllerWrongTokenStrategy"
import { ControllerStrategyToken } from "./src/server/ControllerStrategyToken"

const app = express()
const webSocketServer = new ws.WebSocketServer({ port: 5000 })
const clients: clientsType = {}
const rooms: roomsType = {}
const users: usersType = {}
const games: gamesType = {}
const registrationUsers: registrationUserType = {}
const secretkey = 'verysecretkey'


webSocketServer.on('connection', (webSocket) => {
    // Случайная строка для айди веб-сокета
    let idWS = uuid()
    // Добавляем в клиенты
    clients[idWS] = webSocket
    console.log(`${idWS} - новое подключение`)
    // Id присваивается, если пользователь авторизован. Пока пользователь не авторизован, он определяется по idWS
    let id: string = ""
    webSocket.on('message', async (data) => {
        const parsedData: expectedParsedDataType = JSON.parse(data.toString())
        // При отправке сообщения необходимо крепить токен
        const token = parsedData.token
        const messageController = new WebSocketMessageController()
        if (!token) {
            messageController.defineStrategy(new ControllerStrategyWithoutToken(parsedData, secretkey, webSocket, idWS, registrationUsers))
            messageController.execute()
            return
        }
        else {
            if (!registrationUsers[token]) {
                messageController.defineStrategy(new ControllerWrongTokenStrategy(webSocket))
                messageController.execute()
                return
            }
        }
        // Если токен рабочий, то пользователь получает свой id
        id = registrationUsers[token].id
        // Если пользователя еще нет среди игроков, то создается его пустой профиль с апдейтом текущего клиента
        if (!users[id]) {
            users[id] = {
                id: id,
                name: null,
                currentClient: clients[idWS]
            }
        }
        users[id].currentClient = clients[idWS]
        // Возможно стоит передавать просто user, а не всех юзеров
        messageController.defineStrategy(new ControllerStrategyToken(id, parsedData, rooms, users, games, webSocket))
        messageController.execute()
        return
    })
    webSocket.on("close", () => {
        delete clients[idWS]
        // delete users[id]  возможно лишнее
        console.log(`${idWS} - клиент отключился`)
    })
})
app.use(express.static('/public'))
app.use(cors())
app.get('/', (req, res) => {
    res.send("Hello")
})
app.listen(3000, () => {
    console.log('3000 PORT is been listening')
})