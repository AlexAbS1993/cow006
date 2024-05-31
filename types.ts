import ws from 'ws'
import { IgameParty } from './src/Entities/GameParty/interface'

export type clientsType = {
    [key: string]: ws
}

export type userType = {
    name: string | null,
    currentClient: ws
}

export type roomsType = {
    [key: string]: userType[]
}

export type usersType = {
    [key: string]: userType
}

export type registrationUserType = {
    [key: string]: {
        login: string,
        password: string,
        id: string
    }
}

export enum messageFromClientTypes {
    "doRoomCreate" = "doRoomCreate",
    "enterTheRoom" = "enterTheRoom",
    "exitTheRoom" = "exitTheRoom",
    "setName" = "setName",
    "loginIn" = "loginIn",
    "registrate" = "registrate"
}

type tokenDataType = {
    token: string
}


export type expectedParsedDataType = (createRoomMessageType | enterTheRoomMessageType | exitRoomMessageType | setNameMessageType | loginInDataType |
    registrateDataType
) & tokenDataType

export type createRoomMessageType = {
    type: messageFromClientTypes.doRoomCreate
    data: null
}
export type enterTheRoomMessageType = {
    type: messageFromClientTypes.enterTheRoom,
    data: enterTheRoomDataType
}

export type exitRoomMessageType = {
    type: messageFromClientTypes.exitTheRoom,
    data: exitFromRoom
}

export type setNameMessageType = {
    type: messageFromClientTypes.setName,
    data: {
        name: string
    }
}
export type loginInDataType = {
    type: messageFromClientTypes.loginIn,
    data: {
        login: string,
        password: string,
    }
}
export type registrateDataType = {
    type: messageFromClientTypes.registrate,
    data: {
        login: string,
        password: string
    }
}

// Data-объекты в мессенджах от клиента по разным типам
export type createRoomDataType = {}
export type enterTheRoomDataType = {
    roomToEnter: string
}
export type exitFromRoom = {
    roomFrom: string
}


export type gamesType = {
    [key: string]: IgameParty
}