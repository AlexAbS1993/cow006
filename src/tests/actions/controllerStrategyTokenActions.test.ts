import { enterTheRoomMessageType, exitRoomMessageType, gamesType, messageFromClientTypes, roomsType, usersType } from "../../../types"
import { createShortRoomId, doRoomAction } from "../../server/actions/doRoomAction"
import { v4 as uuid } from 'uuid'
import ws from 'ws'
import { enterTheRoomAction } from "../../server/actions/enterTheRoomAction"
import { exitRoomAction } from "../../server/actions/exitRoomAction"
describe("CSTactions is a procedure for executing operation by parsedData 'type'", () => {
    let mockId = uuid()
    let mockWS = {
        send: (ms: string) => {

        }
    } as ws
    let mockGames: gamesType = {}
    let mockRooms: roomsType = {}
    let mockUsers: usersType = {
        [mockId]: {
            name: "Alex", currentClient: mockWS, id: "sagsga"
        },
        [mockId + "1"]: {
            name: "Valya", currentClient: { ...mockWS } as ws, id: "asg"
        }
    }
    test("function about short id works correctly", () => {
        expect(createShortRoomId().length).toBe(5)
    })
    test("doRoom works with games, users and rooms. It left notes about entities changes", () => {
        doRoomAction(mockRooms, mockUsers[mockId], mockGames)
        for (let room in mockRooms) {
            expect(mockRooms[room][0].name).toBe("Alex")
        }
        for (let game in mockGames) {
            expect(mockGames[game].getLeader()?.getInfo().name).toBe("Alex")
        }
    })
    test("enterTheRoom works with rooms", () => {
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
            expect(mockRooms[room][1].name).toBe("Valya")
            expect(mockRooms[room][0].name).toBe("Alex")
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
        exitRoomAction(mockParsedData, mockRooms, mockUsers[mockId + "1"].currentClient, mockUsers[mockId + "1"])
        for (let room in mockRooms) {
            expect(mockRooms[room].length).toBe(1)
            expect(mockRooms[room][0].name).toBe("Alex")
            expect(mockRooms[room][1]).toBeUndefined()
        }
    })
})