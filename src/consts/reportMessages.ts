type reportMessagesListType = {
    [key: string]: string
}

type reportMessagesLibraryType = {
    [key: string]: reportMessagesListType
}

export const reportMessagesLibrary: reportMessagesLibraryType = {
    Hand: {
        handIsEmpty: "В руке нет карт"
    }
}