import ws from 'ws'
import { IgameParty } from './src/Entities/GameParty/interface'
import { GameMods } from './src/consts/rules'
import { IUser } from './src/server/entities/user/interface'
import { IGame } from './src/Entities/Game/interface'

export type clientsType = {
    [key: string]: ws
}

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
    "validationRegistrationError" = "validationRegistrationError",
    "userConnectToRoom" = "userConnectToRoom",
    "canNotEnterTheRoom" = "canNotEnterTheRoom",
    "roomIsNotExists" = "roomIsNotExists",
    "userHasBeenLeave" = "userHasBeenLeave",
    "logInWrongDatas" = "logInWrongDatas",
    "successLogIn" = "successLogIn",
    "alreadyRegistred" = "alreadyRegistred",
    "successRegistred" = "successRegistred",
    "gameStarted" = "gameStarted",
    "roomCreated" = "roomCreated",
    "playerMakesTurn" = "playerMakesTurn",
    "afterTurnSwitchToCheck" = "afterTurnSwitchToCheck",
    "needToSelectRow" = "needToSelectRow",
    "fromPoolToRowSucces" = "fromPoolToRowSucces",
    "gettingHandSuccess"= "gettingHandSuccess",
    "endGameReady" = "endGameReady",
    "anotherStep" = "anotherStep",
    "cardNotExist" = "cardNotExist",
    "switchToProcess" = "switchToProcess",
     "iAmInAlready" =  "iAmInAlready",
     "GameEndsPlayerLeaves" =  "GameEndsPlayerLeaves",
     "StatisticDoesntSave" = "StatisticDoesntSave",
     "StatisticValidatorError" = "StatisticValidatorError" 
}

export enum messageFromClientTypes {
    "doRoomCreate" = "doRoomCreate",
    "enterTheRoom" = "enterTheRoom",
    "exitTheRoom" = "exitTheRoom",
    "setName" = "setName",
    "loginIn" = "loginIn",
    "registrate" = "registrate",
    "startTheGame" = "startTheGame",
    "playerMakesTurn" = "playerMakesTurn",
    "checkCardFromPool" = "checkCardFromPool",
    "checkCardFromPoolWithReplace" = "checkCardFromPoolWithReplace",
    "needToTakeHands" = "needToTakeHands",
    "getEndGameResults" = "getEndGameResult",
    "iAmInAlready" =  "iAmInAlready"
}

type tokenDataType = {
    token: string
}


export type expectedParsedDataType = (createRoomMessageType | enterTheRoomMessageType | exitRoomMessageType | setNameMessageType | loginInDataType |
    registrateDataType | theGameStartType | playerMakesTurn | checkCardFromPoolType | checkCardFromPoolWithReplaceType | needToTakeHandsMessageDataType |
    endGameMessageDataType | iAmInAlreadyType
) & tokenDataType

export type iAmInAlreadyType = {
    type: messageFromClientTypes.iAmInAlready,
    data: null
}

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

export type playerMakesTurn  = {
    type: messageFromClientTypes.playerMakesTurn,
    data: {
        player: string,
        nOcard: number
    }
}

export type checkCardFromPoolType = {
    type: messageFromClientTypes.checkCardFromPool,
    data: null
}

export type checkCardFromPoolWithReplaceType = {
    type: messageFromClientTypes.checkCardFromPoolWithReplace,
    data: {
        rowIndex: number
    }
}

export type needToTakeHandsMessageDataType = {
    type: messageFromClientTypes.needToTakeHands
}

export type endGameMessageDataType = {
    type: messageFromClientTypes.getEndGameResults
}

// Data-объекты в мессенджах от клиента по разным типам
export type createRoomDataType = {}
export type enterTheRoomDataType = {
    roomToEnter: string
}
export type exitFromRoom = {
    roomFrom: string
}

export type gamesPartiesType = {
    [key: string]: IgameParty
}

export type gamesType = {
    [key: string]: IGame
}