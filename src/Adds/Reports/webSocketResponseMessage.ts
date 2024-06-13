export const webSocketReportMessagesLibrary = {
    userConnected: (user: string) => {
        return `${user} присоединился к комнате`
    },
    gameHasBeenStartedAlready: () => "Игра уже началась",
    roomIsNotExists: () => "Такой комнаты не существует",
    userHasBeenLeaved: (user: string) => `${user} покинул комнату`,
    logInWrongDatas: () => "Неверные данные для входа в систему",
    successLogIn: () => "Вы успешно вошли в систему",
    alreadyRegistred: () => "Пользоавтель с таким логином уже зарегистрирован",
    successRegistred: () => "Успешно зарегистрирован",
    gameStartedFailed: () => "Игру не удалось начать, вы не являетесь лидером",
    gameStartedSuccessfully: () => "Игра стартовала успешно",
    roomCreated: (roomId: string) => `Комнтана ${roomId} успешна создана. Вы её лидер`
}