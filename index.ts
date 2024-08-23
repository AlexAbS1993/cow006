import express from "express"
import cors from 'cors'
import ws from 'ws'
import { v4 as uuid } from 'uuid'
import { clientsType, exitRoomMessageType, expectedParsedDataType, gamesPartiesType, gamesType, messageForSendFromServerEnum, messageFromClientTypes, registrationUserType, roomsType, usersType } from "./types"
import { WebSocketMessageController } from "./src/server/ControllerStrategy"
import { ControllerStrategyWithoutToken } from "./src/server/ControllerStrategyWithoutToken"
import { ControllerWrongTokenStrategy } from "./src/server/ControllerWrongTokenStrategy"
import { ControllerStrategyToken } from "./src/server/ControllerStrategyToken"
import { ControllerStrategyInGame } from "./src/server/ControllerStrategyInGame"
import { Iplayer } from "./src/Entities/Player/interface"
import { exitRoomAction } from "./src/server/actions/exitRoomAction"
import { IUser } from "./src/server/entities/user/interface"
import { playersDataForResponseFromServerDataType, webSocketProcedureReportType } from "./src/Adds/Reports/webSocketReport.type"
import { webSocketReportMessagesLibrary } from "./src/Adds/Reports/webSocketResponseMessage"
import http from 'http'
import MongoDBnoSQL, { modelsNameEnum } from "./src/Database/initialization"
import RegUserMongo from "./src/Database/RegUserMongo"
import { RegUserSelector } from "./src/Entities/RegistratedUser/RegUserSelector"

const path = 'mongodb://AlexAbS:199304@alexabscluster-shard-00-00.qd0fz.mongodb.net:27017,alexabscluster-shard-00-01.qd0fz.mongodb.net:27017,alexabscluster-shard-00-02.qd0fz.mongodb.net:27017/cow006?ssl=true&replicaSet=atlas-y3z80j-shard-0&authSource=admin&retryWrites=true&w=majority&appName=AlexAbSCluster'
const app = express()
app.use(cors())
// db connection 
const db:MongoDBnoSQL = new MongoDBnoSQL()
db.initialize();
db.connect(path)
// (async () => {
//     
//     const admin = {
//         login: 'Alex',
//         password: "199304",
//         hash: '1sag12',
//         id: '1'
//     }
//     await db.mongoose.models[modelsNameEnum.RegUser].create(admin)
// })();
const regUserDB = new RegUserMongo(db)
//---------------
const server = http.createServer(app);
const webSocketServer = new ws.WebSocketServer({ server })
const clients: clientsType = {}
const rooms: roomsType = {}
const users: usersType = {}
const gamesParties: gamesPartiesType = {}
const games:gamesType = {}
// const registrationUsers: registrationUserType = {}
const secretkey = 'verysecretkey'
const registrationUsersV2 = new RegUserSelector(regUserDB)

webSocketServer.on('connection', async (webSocket) => {
    // Случайная строка для айди веб-сокета
    let idWS = uuid()
    // Добавляем в клиенты
    clients[idWS] = webSocket
    console.log(`${idWS} - новое подключение`)
    // Id присваивается, если пользователь авторизован. Пока пользователь не авторизован, он определяется по idWS
    let id: string = ""
    webSocket.send(JSON.stringify({type: 'greetings', data: `hello ${idWS}`}))
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
        let regUser
        let regUserStatus
        try{
            let request = await registrationUsersV2.getRegUser(token)
            regUser = request.data
            regUserStatus = request.success
        }
         catch(e: any){
        //     // Необходимо создать новый отчёт по непредвиденным ошибкам
            throw new Error(e.message)
         }
        if(parsedData.type === messageFromClientTypes.iAmInAlready){
            // if (registrationUsers[token]){
            if (regUserStatus){
                let user = users[regUser!.getId()]
                let inRoomId = user.getRoomId()
                let roomInformation = null
                if (inRoomId){
                    let roomId = user.getRoomId() as string
                    roomInformation = rooms[roomId].map(user => {
                        return {
                            id: user.getId(),
                            name: user.getName()
                        }
                    })
                }
                let data = {
                    login: user.getName(),
                    id: user.getId(),
                    name: user.getName(),
                    inRoomId,
                    roomInformation
                }
                let report = {
                    type: messageForSendFromServerEnum.iAmInAlready,
                    success: true,
                    data,
                    message: "already there"
                }
                webSocket.send(JSON.stringify(report))
            }
            else {
                let report = {
                    type: messageForSendFromServerEnum.iAmInAlready,
                    success: false,
                    message: "no token"
                }
                webSocket.send(JSON.stringify(report))
            }
            return
        }
        const messageController = new WebSocketMessageController()
        if (!token) {
            messageController.defineStrategy(new ControllerStrategyWithoutToken(parsedData, secretkey, webSocket, idWS, registrationUsersV2, users))
            messageController.execute()
            return
        }
        else {
            // if (!registrationUsers[token]) {
            if (regUserStatus) {
                messageController.defineStrategy(new ControllerWrongTokenStrategy(webSocket))
                messageController.execute()
                return
            }
        }
        // Если токен рабочий, то пользователь получает свой id
        id = regUser!.getId()
        // Если пользователя еще нет среди игроков, то создается его пустой профиль
        // if (!users[id]) {
        //     users[id] = new User(id, id)
        // }
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
            messageController.defineStrategy(new ControllerStrategyInGame(parsedData, rooms[currentRoom], gamesParties[currentRoom],currentGame, registrationUsersV2))
            messageController.execute()
            return
        }
    })
    webSocket.on("close", () => {
        for (let user in users){
            let currentUser:IUser = users[user]
            if(currentUser.getWSId() === idWS){
                if (currentUser.getGameId()){
                    let dataForSend = {
                        userName: currentUser.getName(),
                    }
                    let report: webSocketProcedureReportType<typeof dataForSend>={
                        data: dataForSend,
                        type: messageForSendFromServerEnum.GameEndsPlayerLeaves,
                        message: webSocketReportMessagesLibrary.playerLeavesFromGame(dataForSend.userName),
                        success: true
                    }
                    let roomId = currentUser.getRoomId()
                    let gameId = currentUser.getGameId()
                    if (rooms[currentUser.getRoomId() as string]){
                        for (let client of rooms[currentUser.getRoomId() as string]) {
                            client.getWS()!.send(JSON.stringify(report))
                            client.setInGame(false)
                            client.setRoom(null) 
                            client.setGameId(null)
                        }
                    }
                    delete gamesParties[roomId as string]
                    delete rooms[roomId as string]
                    delete games[gameId as string]
                    currentUser.setInGame(false)
                    currentUser.setRoom(null) 
                    currentUser.setGameId(null)
                }
                if(currentUser.getRoomId()){
                    let parsedData: exitRoomMessageType = {
                        type: messageFromClientTypes.exitTheRoom,
                        data: {
                            roomFrom: currentUser.getRoomId() as string
                        }
                    }
                    exitRoomAction(parsedData, rooms, webSocket, currentUser, gamesParties)
                    let report: webSocketProcedureReportType<Pick<playersDataForResponseFromServerDataType, "name"|"id">&{leaderId: string}> = {
                        success: true,
                        message: webSocketReportMessagesLibrary.userHasBeenLeaved(currentUser.getName() as string),
                        type: messageForSendFromServerEnum.userHasBeenLeave,
                        data: {
                            name: currentUser.getName(),
                            id: currentUser.getId(),
                            leaderId: gamesParties[parsedData.data.roomFrom].getLeader()?.getId() as string
                        }
                    }
                    if (rooms[parsedData.data.roomFrom]){
                        for (let client of rooms[parsedData.data.roomFrom]) {
                            client.getWS()!.send(JSON.stringify(report))
                        }
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

app.get('/rooms', (req, res) => {
    res.send(rooms)
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


server.listen(3000, () => {
    console.log('3000 PORT is been listening')
})