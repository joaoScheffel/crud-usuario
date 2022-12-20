import { model, Schema } from "mongoose"
import { IDefaultConfig } from "../config/interface-user"


export interface IUserConfiguration extends IDefaultConfig {
    password?: string
    passwordUpdatedAt?: Date

    birthDate?: Date
    username?: string

    typePermissions?: TypeUserPermission
    isEmailVerified?: boolean
}

export enum TypeUserPermission {
    DEFAULT = 'DEFAULT',
    COMPANY = 'COMPANY',
    ADMIN = 'ADMIN',
    MASTER = 'MASTER'
}

export const UserConfigurationSchema: Schema<IUserConfiguration> = new Schema<IUserConfiguration>({
    userUuid: {
        type: String,
        required: [true, 'The user uuid must be informed!'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'The email must be informed!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password must be informed!'],
        select: false
    },
    passwordUpdatedAt: {
        type: Date,
        required: false
    },
    telephone: {
        type: String,
        required: false,
        unique: true
    },
    birthDate: {
        type: Date,
        required: [true, 'The birthdate must be informed!']
    },
    name: {
        type: String,
        required: [true, 'The name must be informed!']
    },
    username: {
        type: String,
        required: [true, 'The username must be informed!'],
        unique: true
    },
    profilePic: {
        type: String,
        required: false
    },
    typePermissions: {
        type: String,
        required: [true, 'The permissions of user must be informed!']
    },
    isEmailVerified: {
        type: Boolean,
        required: false
    },
}, {
    timestamps: true
})

export const UserCollection = model<IUserConfiguration>('UserCollection', UserConfigurationSchema, 'users')