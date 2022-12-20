import { Request } from "express";
import { IUserConfiguration } from "../user/user-config";
import { validateBody } from "./express-validator";
import bcrypt from 'bcryptjs'
import { searchUserUtils } from "../utils/search-user-utils";
import { UserControlManager } from "../user/user-control-manager-class";
import { generateJWT } from "../json-web-token/generate-jwt";
import { ISendEmailConfig } from "../nodemailer/abstract-send-email-config";
import { checkJWT } from "../json-web-token/check-jwt";


export class UserSessionService {

    async registerUser(req: Request): Promise<IUserConfiguration> {
        if (!req.body) {
            throw new Error('Requisition type invalid!')
        }
        let { email, password, confirmPassword, telephone, birthDate, name, username } = req.body

        if (!email || !password || !confirmPassword || !telephone || !birthDate || !name || !username) {
            throw new Error('Requisition body invalid!')
        }

        await validateBody.validate(req)

        const hash = await bcrypt.hash(password, 10)
        password = hash

        const userConfiguration: IUserConfiguration = {
            email: email,
            password: password,
            telephone: telephone,
            birthDate: birthDate,
            name: name,
            username: username
        }

        return userConfiguration
    }

    async loginUser(req: Request): Promise<string> {
        if (!req.body) {
            throw new Error('Requisition type inválid!')
        }
        const { user, password } = req.body

        if (!user || !password) {
            throw new Error('Requisition body invalid!')
        }

        const userConfiguration: IUserConfiguration = await searchUserUtils.findUserByUsernameOrEmail(user, true)

        const userManager: UserControlManager = new UserControlManager(userConfiguration)

        if (!userManager) {
            throw new Error('User not found!')
        }

        if (!await userManager.compareUserPassword(password)) {
            throw new Error('Password invalid!')
        }

        return userManager.userUuid
    }

    async sendMailToRedefinePassword(req: Request): Promise<ISendEmailConfig> {
        if (!req.body) {
            throw new Error('Requisition type inválid!')
        }
        const { email } = req.body

        if (!email) {
            throw new Error('Requisition body invalid!')
        }

        const userConfiguration: IUserConfiguration = await searchUserUtils.findUserByUsernameOrEmail(email)

        const userManager: UserControlManager = new UserControlManager(userConfiguration)

        if (!await userManager.checkPasswordUpdatedAtValidity(1)) {
            throw new Error('The password has been changed recently, need to wait an hour since the change!')
        }

        const token = generateJWT.generateUserToken(userManager.userUuid, '1h')

        const sendEmailConfig: ISendEmailConfig = {
            to: email,
            subject: 'Teste',
            template: 'redefine-pass-email',
            context: { token }
        }

        return sendEmailConfig
    }

    async redefinePassword(req: Request): Promise<UserControlManager> {
        if (!req.body) {
            throw new Error('Requisition body invalid!')
        }
        if (req.query && req.query.code) {
            const code = (req.query as any).code

            const { newPassword } = req.body

            if (!newPassword) {
                throw new Error('Requisition body invalid!')
            }

            if (newPassword.length < 8) {
                throw new Error('The password must have a minimum of 8 letters!')
            }

            const userUuidByToken: string = await checkJWT.check(code)

            const userConfiguration: IUserConfiguration = await searchUserUtils.findUserByUuid(userUuidByToken, true)

            const userManager: UserControlManager = new UserControlManager(userConfiguration)

            if (!await userManager.checkPasswordUpdatedAtValidity(1)) {
                throw new Error('The password has been changed recently, need to wait an hour since the change!')
            }

            if (await userManager.compareUserPassword(newPassword) === true) {
                throw new Error('The new password cant be equal a old password!')
            }

            return userManager
        } else {
            throw new Error('Requisition type invalid!')
        }
    }

    async verifyEmail(req: Request): Promise<IUserConfiguration> {
        if (req.query && req.query.code) {

            const code = (req.query as any).code

            const userUuidByToken: string = await checkJWT.check(code, true)

            const userConfiguration: IUserConfiguration = await searchUserUtils.findUserByUuid(userUuidByToken, true)

            return userConfiguration

        } else {
            throw new Error('Requisition type invalid!')
        }
    }
}

export const userSessionService = new UserSessionService()