
export type gameStatistic = {
    matches: number
    wins: number
    looses: number
}

export interface IRegUser {
    login: string;
    password: string;
    hash: string;
    id: string;
    statistic: gameStatistic
}