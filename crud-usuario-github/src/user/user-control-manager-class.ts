import { IUserConfiguration, UserCollection } from "./user-config";
import bcrypt from 'bcryptjs'
import UserControl from "./user-control-class";
import { searchUserUtils } from "../utils/search-user-utils";

export interface ISimpleUserData {
    name?: string
    username?: string
    telephone?: string
    birthDate?: Date
}

export class UserControlManager extends UserControl {
    readonly userUuid: string
    readonly email: string
    readonly telephone: string
    private password: string

    constructor (userConfig: IUserConfiguration) {
        super()
        this.userUuid = userConfig.userUuid
        this.email = userConfig.email
        this.telephone = userConfig.telephone
        this.password = userConfig.password
    }

    async updateData(newData: ISimpleUserData): Promise<void> {
        if (await UserCollection.findOne({ telephone: newData.telephone }) && (await UserCollection.findOne({ telephone: newData.telephone })).userUuid !== this.userUuid) {
            throw new Error('Telephone already in use!')
        }

        if (await UserCollection.findOne({ username: newData.username }) && (await UserCollection.findOne({ username: newData.username })).userUuid !== this.userUuid) {
            throw new Error('Username already in use!')
        }

        await UserCollection.findOneAndUpdate({ userUuid: this.userUuid }, {
            $set: {
                name: newData.name,
                username: newData.username,
                telephone: newData.telephone,
                birthDate: newData.birthDate
            }
        })
    }

    async compareUserPassword(password: string): Promise<boolean> {
        if (!await bcrypt.compare(password, this.password)) {
            return false
        }

        if (await bcrypt.compare(password, this.password)) {
            return true
        }
    }

    async updatePassword(newPassword: string): Promise<void> {
        const userCollection = await UserCollection.findOne({ userUuid: this.userUuid }).select('+password')

        if (userCollection.passwordUpdatedAt) {
            const validity: Date = userCollection.passwordUpdatedAt
            const now: Date = new Date()
            now.setHours(now.getHours() - 1)

            if (now < validity) {
                throw new Error('The password has been changed recently, need to wait an hour since the change!')
            }
        }

        newPassword = await bcrypt.hash(newPassword, 10)

        userCollection.password = newPassword
        userCollection.passwordUpdatedAt = new Date()

        await userCollection.save()
    }

    async checkPasswordUpdatedAtValidity(hoursValidity: number): Promise<boolean> {
        const userConfiguration: IUserConfiguration = await searchUserUtils.findUserByUuid(this.userUuid)
        const now = new Date()
        now.setHours(now.getHours() - hoursValidity)
        if (now < userConfiguration?.passwordUpdatedAt) {
            return false
        }

        return true
    }

    async checkIsEmailVerified(): Promise<boolean> {
        const userConfiguration: IUserConfiguration = await searchUserUtils.findUserByUuid(this.userUuid)
        if (!userConfiguration.isEmailVerified) {
            return false
        }
        return true
    }

    async validateEmail(): Promise<void> {
        const userCollection = await UserCollection.findOne({ userUuid: this.userUuid })

        if (!userCollection) {
            throw new Error('UserUuid not found!')
        }

        userCollection.isEmailVerified = true

        await userCollection.save()
    }
}
