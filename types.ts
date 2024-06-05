import ws from 'ws'
import { IgameParty } from './src/Entities/GameParty/interface'
import { GameMods } from './src/consts/rules'
import { IUser } from './src/server/entities/user/interface'

export type clientsType = {
    [key: string]: ws
}

// export type userType = {
//     id: string,
//     name: string | null,
//     currentClient: ws
//     inGame: boolean
// }

export type roomsType = {
    [key: string]: IUser[]
}

export type usersType = {
    [key: string]: IUser
}

export type registrationUserType = {
    [key: string]: {
        login: string,
        password: string,
        id: string
    }
}

export enum messageForSendFromServerEnum {
    "userConnectToRoom" = "userConnectToRoom",
    "gameHasBeenStartedAlready" = "gameHasBeenStartedAlready",
    "roomIsNotExists" = "roomIsNotExists",
    "userHasBeenLeave" = "userHasBeenLeave",
    "logInWrongDatas" = "logInWrongDatas",
    "successLogIn" = "successLogIn",
    "alreadyRegistred" = "alreadyRegistred",
    "successRegistred" = "successRegistred",
    "gameStarted" = "gameStarted"
}

export enum messageFromClientTypes {
    "doRoomCreate" = "doRoomCreate",
    "enterTheRoom" = "enterTheRoom",
    "exitTheRoom" = "exitTheRoom",
    "setName" = "setName",
    "loginIn" = "loginIn",
    "registrate" = "registrate",
    "startTheGame" = "startTheGame"
}

type tokenDataType = {
    token: string
}


export type expectedParsedDataType = (createRoomMessageType | enterTheRoomMessageType | exitRoomMessageType | setNameMessageType | loginInDataType |
    registrateDataType | theGameStartType
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

export type theGameStartType = {
    type: messageFromClientTypes.startTheGame,
    data: {
        mode: GameMods
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