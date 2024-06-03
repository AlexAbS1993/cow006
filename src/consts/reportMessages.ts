type reportMessagesHandType = typeof reportMessagesLibrary.Hand[keyof typeof reportMessagesLibrary.Hand]
// {
//     [key in keyof typeof reportMessagesLibrary.Hand]: typeof reportMessagesLibrary.Hand[keyof typeof reportMessagesLibrary.Hand]
// }
type reportMessagesOkType = typeof reportMessagesLibrary.ok[keyof typeof reportMessagesLibrary.ok]
// {
//     [key in keyof typeof reportMessagesLibrary.ok]: typeof reportMessagesLibrary.ok[keyof typeof reportMessagesLibrary.ok]
// }
type reportMessageGamePartyType = typeof reportMessagesLibrary.GameParty[keyof typeof reportMessagesLibrary.GameParty]
type reportMessageServerType = typeof reportMessagesLibrary.server[keyof typeof reportMessagesLibrary.server]

type reportMessagesListType = reportMessagesHandType | reportMessagesOkType | reportMessageGamePartyType | reportMessageServerType
export type reportMessagesLibraryType = reportMessagesListType

export const reportMessagesLibrary = {
    ok: {
        okMessage: "ok" as const
    } as const,
    Hand: {
        handIsEmpty: "В руке нет карт" as const,
        overLimit: "Нельзя пополнить руку верх лимита" as const,
        noRequiredCardInHand: "Такой карты нет в руке" as const
    } as const,
    GameParty: {
        more4Player: "Слишком много игроков. Максимум - 4" as const,
        noThatPlayer: "Такого игрока нет в пати" as const
    } as const,
    server: {
        wrongLogInData: "Неверные данные для входа" as const,
        gameIsAlreadyStarted: "Игра уже началась" as const,
        roomIsNotExist: "Комнаты не существует" as const
    } as const
}