export type ValidatorReportType = {
    success: boolean,
    message: string,
    type: ValidatorReportEnum 
}

export enum ValidatorReportEnum {
    "WrongType" = "WrongType",
    "NoRequiredField" = "NoRequiredField",
    "ok" = 'ok'
}