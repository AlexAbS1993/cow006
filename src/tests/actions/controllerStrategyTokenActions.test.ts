import { enterTheRoomMessageType, exitRoomMessageType, gamesType, messageFromClientTypes, roomsType, usersType } from "../../../types"
import { createShortRoomId, doRoomAction } from "../../server/actions/doRoomAction"
import { v4 as uuid } from 'uuid'
import ws from 'ws'
import { enterTheRoomAction } from "../../server/actions/enterTheRoomAction"
import { exitRoomAction } from "../../server/actions/exitRoomAction"
import { User } from "../../server/entities/user/model"
describe("CSTactions is a procedure for executing operation by parsedData 'type'", () => {
    let mockId = uuid()
    let mockWS = {
        send: (ms: string) => {

        }
    } as ws
    let mockGames: gamesType = {}
    let mockRooms: roomsType = {}
    let mockUsers: usersType = {
        [mockId]: new User("sagsga", "Alex"),
        [mockId + "1"]: new User("asg", "Valya")
    }
    mockUsers[mockId].setCurrentWebSocket(mockWS)
    mockUsers[mockId + "1"].setCurrentWebSocket({ ...mockWS } as ws)

    test("function about short id works correctly", () => {
        expect(createShortRoomId().length).toBe(5)
    })
    test("doRoom works with games, users and rooms. It left notes about entities changes", () => {
        doRoomAction(mockRooms, mockUsers[mockId], mockGames)
        for (let room in mockRooms) {
            expect(mockRooms[room][0].getName()).toBe("Alex")
        }
        for (let game in mockGames) {
            expect(mockGames[game].getLeader()?.getInfo().name).toBe("Alex")
        }
        for (let user in mockUsers) {
            if (mockUsers[user].getName() === "Alex") {
                expect(mockUsers[user].inGame()).toBe(true)
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
        enterTheRoomAction(mockParsedData, mockWS, mockRooms, mockGames, mockUsers[mockId + "1"])
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
})