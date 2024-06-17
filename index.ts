import express from "express"
import cors from 'cors'
import ws from 'ws'
import { v4 as uuid } from 'uuid'
import { clientsType, exitRoomMessageType, expectedParsedDataType, gamesPartiesType, gamesType, messageForSendFromServerEnum, messageFromClientTypes, registrationUserType, roomsType, usersType } from "./types"
import { WebSocketMessageController } from "./src/server/ControllerStrategy"
import { ControllerStrategyWithoutToken } from "./src/server/ControllerStrategyWithoutToken"
import { ControllerWrongTokenStrategy } from "./src/server/ControllerWrongTokenStrategy"
import { ControllerStrategyToken } from "./src/server/ControllerStrategyToken"
import { User } from "./src/server/entities/user/model"
import { ControllerStrategyInGame } from "./src/server/ControllerStrategyInGame"
import { Iplayer } from "./src/Entities/Player/interface"
import { exitRoomAction } from "./src/server/actions/exitRoomAction"
import { IUser } from "./src/server/entities/user/interface"
import { webSocketProcedureReportType } from "./src/Adds/Reports/webSocketReport.type"
import { webSocketReportMessagesLibrary } from "./src/Adds/Reports/webSocketResponseMessage"

const app = express()
const webSocketServer = new ws.WebSocketServer({ port: 5000 })
const clients: clientsType = {}
const rooms: roomsType = {}
const users: usersType = {}
const gamesParties: gamesPartiesType = {}
const games:gamesType = {}
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
        let parsedData: expectedParsedDataType
        try{
            parsedData = JSON.parse(data.toString())
        }
        catch(e){
            console.log('Parse JSON error')
            webSocket.send("Parse JSON error")
            return
        }
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
        // Если пользователя еще нет среди игроков, то создается его пустой профиль
        if (!users[id]) {
            users[id] = new User(id, id)
        }
        users[id].setWSId(idWS)
        users[id].setCurrentWebSocket(webSocket)
        // Возможно стоит передавать просто user, а не всех юзеров
        if(!users[id].inGame()){
            messageController.defineStrategy(new ControllerStrategyToken(id, parsedData, rooms, users, gamesParties, webSocket, games))
            messageController.execute()
            return
        }
        else {
            let currentRoom = users[id].getRoomId() as string
            let currentPlayer: Iplayer|null = null
            for (let player of gamesParties[currentRoom].getPlayers()){
                if(player.getId() === id){
                    currentPlayer = player
                }
            }
            let currentGame = games[users[id].getGameId() as string]
            messageController.defineStrategy(new ControllerStrategyInGame(parsedData, rooms[currentRoom], gamesParties[currentRoom], users[id], currentPlayer as Iplayer, currentGame))
            messageController.execute()
            return
        }
    })
    webSocket.on("close", () => {
        for (let user in users){
            let currentUser:IUser = users[user]
            if(currentUser.getWSId() === idWS){
                if(currentUser.getRoomId()){
                    let parsedData: exitRoomMessageType = {
                        type: messageFromClientTypes.exitTheRoom,
                        data: {
                            roomFrom: currentUser.getRoomId() as string
                        }
                    }
                    exitRoomAction(parsedData, rooms, webSocket, currentUser, gamesParties)
                    let report: webSocketProcedureReportType = {
                        success: true,
                        message: webSocketReportMessagesLibrary.userHasBeenLeaved(currentUser.getName() as string),
                        type: messageForSendFromServerEnum.userHasBeenLeave
                    }
                    for (let client of rooms[parsedData.data.roomFrom]) {
                        client.getWS()!.send(JSON.stringify(report))
                    }
                }
            }
        }
        delete clients[idWS]
        console.log(`${idWS} - клиент отключился`)
    })
})
app.use(express.static('/public'))
app.use(cors())
app.get('/users', (req, res) => {
    let mappedUsers:any = {}
    for (let userKey in  users){
        mappedUsers[userKey] = {
            id: users[userKey].getId(),
            gameId: users[userKey].getGameId(),
            roomId: users[userKey].getRoomId(),
            name: users[userKey].getName()
        }
    }
    res.send(mappedUsers)
})

app.get("/games/:id/hand/:name", (req, res) => {
    let gameId = req.params.id
    let playersName = req.params.name
    let players = games[gameId].getPlayers()
    let playersHand = players.find(player => player.getInfo().name === playersName)
    res.send(playersHand)
})

app.get("/games/:id/rows", (req, res) => {
    let gameId = req.params.id
    let rows = games[gameId].getRows()
    res.send(rows)
})


app.get('/games/:id', (req, res) => {
    let gameId = req.params.id
    let game:any = {}
    game.players = games[gameId].getPlayers()
    game.pool = games[gameId].getPool()
    game.rows = games[gameId].getRows()
    res.send(game)
})


app.listen(3000, () => {
    console.log('3000 PORT is been listening')
})