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
    roomCreated: (roomId: string) => `Комната ${roomId} успешно создана. Вы её лидер`,
    playerMakeTurn: (name: string) => `Игрок ${name} сделал свой выбор`,
    afterTurnSwitchToChek: (name: string) => `После выбора игрока ${name} начинается стадия проверки. Ожидание подтверждения`,
    inRoomAlready: () => `Вы уже находитесь в комнате`,
    needToSelectRow: () => "Необходимо выбрать полосу для замены",
    fromPoolToRowSuccess: () => "Карта успешно размещена, необходима следующая проверка",
    successGettingHand: () => "Руки игрока успешно сформированы",
    endGameNotify: () => "Игра завершена, затребуйте результирующие данные",
    anotherStep: () => "Действие невозможно. Другая стадия игры",
    cardDosntExist: () => "Карты нет в руке",
    switchToProcess: () => "Карта успешно размещена. Переключение на игровой процесс"
}