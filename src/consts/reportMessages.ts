type reportMessagesHandType = typeof reportMessagesLibrary.Hand[keyof typeof reportMessagesLibrary.Hand]
// {
//     [key in keyof typeof reportMessagesLibrary.Hand]: typeof reportMessagesLibrary.Hand[keyof typeof reportMessagesLibrary.Hand]
// }
type reportMessagesOkType = typeof reportMessagesLibrary.ok[keyof typeof reportMessagesLibrary.ok]
// {
//     [key in keyof typeof reportMessagesLibrary.ok]: typeof reportMessagesLibrary.ok[keyof typeof reportMessagesLibrary.ok]
// }



type reportMessagesListType = reportMessagesHandType | reportMessagesOkType
export type reportMessagesLibraryType = reportMessagesListType

export const reportMessagesLibrary = {
    ok: {
        okMessage: "ok" as const
    } as const,
    Hand: {
        handIsEmpty: "В руке нет карт" as const, 
        overLimit: "Нельзя пополнить руку верх лимита" as const,
        noRequiredCardInHand: "Такой карты нет в руке" as const
    }as const
}