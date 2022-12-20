import { IUserConfiguration, TypeUserPermission, UserCollection } from "./user-config"
import { v4 as uuidV4 } from 'uuid'


export default class UserControl {
    async createCollection(userConfig: IUserConfiguration): Promise<void> {
        if (await UserCollection.findOne({ email: userConfig.email })) {
            if ((await UserCollection.findOne({ email: userConfig.email })).isEmailVerified == false) {
                throw new Error('Email not verified, check in inbox email!')
            }
            throw new Error('Email already in use!')
        }

        if (await UserCollection.findOne({ username: userConfig.username })) {
            throw new Error('Username already in use!')
        }

        if (await UserCollection.findOne({ telephone: userConfig.telephone })) {
            throw new Error('Telephone already in use!')
        }

        const userCollection = await UserCollection.create({
            userUuid: uuidV4(),
            email: userConfig.email,
            password: userConfig.password,
            passwordUpdatedAt: userConfig.passwordUpdatedAt,
            telephone: userConfig.telephone,
            birthDate: userConfig.birthDate,
            name: userConfig.name,
            username: userConfig.username,
            profilePic: userConfig.profilePic,
            typePermissions: TypeUserPermission.DEFAULT,
            isEmailVerified: false
        })

        await userCollection.save()
    }
}

export const userControl = new UserControl()