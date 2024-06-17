import { IUser } from "../../../server/entities/user/interface";
import { roomCreatedResponseFromServerDataType } from "../webSocketReport.type";

export function roomCreatedForResponseCreator(user: IUser): roomCreatedResponseFromServerDataType{
    return {
        roomId: user.getRoomId() as string
    }
}