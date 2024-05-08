import { playerInfoType } from "../../../Entities/Player/interface";
const randomNames = ["Alex", "Yoka", "Valentin", "Inna","Pedro", "Hulio", "Ignasio", "Chikipishka", "Tinka", "Akakiy"]

export function playersInfoGenerator(): playerInfoType{
    let randomNumber = Math.floor(Math.random() * 101) 
    let name = randomNames[Math.floor(Math.random() * randomNames.length)]
    let rang = randomNumber
    let stats = {
        wins: randomNumber,
        looses: randomNumber
    }
    return {
        name, rang, stats
    }
}