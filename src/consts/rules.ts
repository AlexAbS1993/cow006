import e from "express"

export const gameRules = {
    maximumPlayers: 4,
    minReadyToStartPlayers: 2
}


export enum GameMods {
    "classic" = "classic",
    "tactic" = "tactic"
}

export enum GameStates {
    "prepearing" = "prepearing", "process" = "process", "end" = "end"
}

export enum GameSteps {
    'cardSelection' = 'cardSelection',
    'summary' = 'summary'
}