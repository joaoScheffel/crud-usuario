import { ITimesTamps } from "../timestamps/timestamps-config";

export interface IDefaultConfig extends ITimesTamps {
    id?: string
    userUuid?: string
    email?: string
    telephone?: string
    name?: string

    profilePic?: string
}