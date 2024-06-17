import { enterTheRoomMessageType, exitRoomMessageType, gamesPartiesType, gamesType, messageFromClientTypes, roomsType, theGameStartType, usersType } from "../../../types"
import { createShortRoomId, doRoomAction } from "../../server/actions/doRoomAction"
import { v4 as uuid } from 'uuid'
import ws from 'ws'
import { enterTheRoomAction } from "../../server/actions/enterTheRoomAction"
import { exitRoomAction } from "../../server/actions/exitRoomAction"
import { User } from "../../server/entities/user/model"
import { startTheGameAction } from "../../server/actions/startTheGameAction"
import { GameMods } from "../../consts/rules"
import { Player } from "../../Entities/Player/model"
import { playersInfoGenerator } from "../entitites/helpers/playersInfoGenerator"
import { GameParty } from "../../Entities/GameParty/model"
import { Iplayer } from "../../Entities/Player/interface"
describe("CSTactions is a procedure for executing operation by parsedData 'type'", () => {
    let mockId = uuid()
    let mockWS = {
        send: (ms: string) => {

        }
    } as ws
    let mockGames: gamesPartiesType = {}
    let mockRooms: roomsType = {}
    let mockUsers: usersType = {
        [mockId]: new User("sagsga", "Alex"),
        [mockId + "1"]: new User("asg", "Valya")
    }
    let mockStartedGames: gamesType = {}
    mockUsers[mockId].setCurrentWebSocket(mockWS)
    mockUsers[mockId + "1"].setCurrentWebSocket({ ...mockWS } as ws)

    test("function about short id works correctly", () => {
        expect(createShortRoomId().length).toBe(5)
    })
    test("doRoom works with games, users and rooms. It left notes about entities changes", () => {
        doRoomAction(mockRooms, mockUsers[mockId], mockGames)
        let roomId:string = ''
        for (let room in mockRooms) {
            roomId = room
            expect(mockRooms[room][0].getName()).toBe("Alex")
        }
        for (let game in mockGames) {
            expect(mockGames[game].getLeader()?.getInfo().name).toBe("Alex")
        }
        for (let user in mockUsers) {
            if (mockUsers[user].getName() === "Alex") {
                expect(mockUsers[user].getRoomId()).toBe(roomId as string)
            }
        }
    })
    test("enterTheRoom works with rooms and games", () => {
        let mockParsedData: enterTheRoomMessageType = {
            type: messageFromClientTypes.enterTheRoom,
            data: {
                roomToEnter: ""
            }
        }
        for (let game in mockGames) {
            mockParsedData.data.roomToEnter = mockGames[game].getGPid()
        }
        enterTheRoomAction(mockParsedData.data.roomToEnter, mockWS, mockRooms, mockGames, mockUsers[mockId + "1"])
        for (let room in mockRooms) {
            expect(mockRooms[room][1].getName()).toBe("Valya")
            expect(mockRooms[room][0].getName()).toBe("Alex")
        }
        for (let game in mockGames) {
            expect(mockGames[game].getPlayers().length).toBe(2)
        }

    })
    test("exitRoom works with rooms", () => {
        let mockParsedData: exitRoomMessageType = {
            type: messageFromClientTypes.exitTheRoom,
            data: {
                roomFrom: ""
            }
        }
        for (let room in mockRooms) {
            mockParsedData.data.roomFrom = room
        }
        exitRoomAction(mockParsedData, mockRooms, mockUsers[mockId + "1"].getWS() as ws, mockUsers[mockId + "1"], mockGames)
        for (let room in mockRooms) {
            expect(mockRooms[room].length).toBe(1)
            expect(mockRooms[room][0].getName()).toBe("Alex")
            expect(mockRooms[room][1]).toBeUndefined()
            expect(mockGames[room].getPlayers().length).toBe(1)
        }
    })
    test("StartGameAction запускает игру и проводит её подготовительную фазу", ()=> {
        let mockParsedData: theGameStartType = {
            type: messageFromClientTypes.startTheGame,
            data: {
                mode: GameMods.classic
            }
        }
        doRoomAction(mockRooms, mockUsers[mockId], mockGames)
        let roomId:string = mockUsers[mockId].getRoomId() as string
        let mockParsedDataForEnter: enterTheRoomMessageType = {
            type: messageFromClientTypes.enterTheRoom,
            data: {
                roomToEnter: roomId
            }
        }
        let initiator = mockGames[roomId].getLeader() as Iplayer
        enterTheRoomAction(roomId, { ...mockWS } as ws, mockRooms, mockGames, mockUsers[mockId + `1`] )
        startTheGameAction(mockParsedData, mockGames[roomId], initiator, mockRooms[roomId], mockStartedGames)
        let gameId = mockUsers[mockId].getGameId()
        let players = mockStartedGames[gameId as string].getPlayers()
        expect(players[0].inGame()).toBe(true)
        expect(players[1].inGame()).toBe(true)
        
    })
})