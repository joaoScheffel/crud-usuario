import { IUserConfiguration, TypeUserPermission, UserCollection } from "../user/user-config";

export class SearchUserUtils {
    async findUserByUsernameOrEmail(user: string, isPasswordSelected?: boolean): Promise<IUserConfiguration> {
        let userConfiguration: IUserConfiguration

        if (isPasswordSelected === true) {
            userConfiguration = await UserCollection.findOne({
                $or: [{
                    email: user
                }, {
                    username: user
                }]
            }).select('+password')

            if (!userConfiguration) {
                throw new Error('Email or username not found!')
            }
        }
        userConfiguration = await UserCollection.findOne({
            $or: [{
                email: user
            }, {
                username: user
            }]
        })

        if (!userConfiguration) {
            throw new Error('Email or username not found!')
        }

        return userConfiguration
    }

    async findUserByUuid(uuid: string, isPasswordSelected?: boolean): Promise<IUserConfiguration> {
        let userConfiguration: IUserConfiguration

        if (isPasswordSelected === true) {
            userConfiguration = await UserCollection.findOne({ userUuid: uuid }).select('+password')
            if (!userConfiguration) {
                throw new Error('User not found!')
            }

            return userConfiguration
        }

        userConfiguration = await UserCollection.findOne({ userUuid: uuid })
        if (!userConfiguration) {
            throw new Error('User not found!')
        }

        return userConfiguration
    }

    async findAllAdminsAndMaster(): Promise<IUserConfiguration[]> {
        const ret: IUserConfiguration[] = await UserCollection.find({
            $or: [{
                typePermissions: TypeUserPermission.ADMIN
            },
            {
                typePermissions: TypeUserPermission.MASTER
            }]
        })

        return ret
    }
}

export const searchUserUtils = new SearchUserUtils()