type regUserResponseType = typeof validatorResponseMessage[keyof typeof validatorResponseMessage]

export type validatorResponseMessageLibrary = regUserResponseType

export const validatorResponseMessage = {
    wrongDataSet: "Неверный набор данных. Недостаточно требуемых полей" as const,
    wrongType: "Неверный тип данных" as const
}